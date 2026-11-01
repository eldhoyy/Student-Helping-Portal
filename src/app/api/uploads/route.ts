import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";

export const runtime = "nodejs";

const BUCKET = "ktu-uploads";
const MAX_FILE_SIZE = 500 * 1024 * 1024;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase Storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY to the deployment environment.");
  }

  return { url: url.replace(/\/$/, ""), serviceKey };
}

function headers(serviceKey: string, contentType = "application/json") {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": contentType,
  };
}

function safeFilename(filename: string) {
  const normalized = filename.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  const dot = normalized.lastIndexOf(".");
  const extension = dot >= 0 ? normalized.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  const basename = (dot >= 0 ? normalized.slice(0, dot) : normalized)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${basename || "upload"}-${crypto.randomUUID()}${extension}`;
}

async function ensureBucket(url: string, serviceKey: string) {
  const check = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, {
    headers: headers(serviceKey),
    cache: "no-store",
  });

  if (check.ok) return;
  if (check.status !== 404) {
    throw new Error("Unable to verify the Supabase upload bucket");
  }

  const create = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: headers(serviceKey),
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_FILE_SIZE,
    }),
  });

  if (!create.ok && create.status !== 409) {
    const message = await create.text();
    throw new Error(message || "Unable to create the Supabase upload bucket");
  }
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  try {
    const body = await req.json();
    const filename = typeof body?.filename === "string" ? body.filename : "";
    const contentType = typeof body?.contentType === "string" && body.contentType
      ? body.contentType
      : "application/octet-stream";
    const size = Number(body?.size ?? 0);

    if (!filename.trim()) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }
    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "A valid file size is required" }, { status: 400 });
    }
    if (size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be 500MB or smaller" }, { status: 400 });
    }

    const { url, serviceKey } = getSupabaseConfig();
    await ensureBucket(url, serviceKey);

    const path = `admin/${safeFilename(filename)}`;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const signResponse = await fetch(
      `${url}/storage/v1/object/upload/sign/${BUCKET}/${encodedPath}`,
      {
        method: "POST",
        headers: headers(serviceKey),
        body: JSON.stringify({}),
      }
    );

    if (!signResponse.ok) {
      const message = await signResponse.text();
      throw new Error(message || "Unable to create a signed upload URL");
    }

    const signed = await signResponse.json();
    const relativeUrl = signed.url ?? signed.signedURL ?? signed.signedUrl;
    if (!relativeUrl) {
      throw new Error("Supabase did not return a signed upload URL");
    }

    const signedUrl = new URL(relativeUrl, url).toString();
    const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${encodedPath}`;

    return NextResponse.json({ signedUrl, publicUrl, path });
  } catch (error) {
    console.error("Upload signing failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare the file upload" },
      { status: 500 }
    );
  }
}
