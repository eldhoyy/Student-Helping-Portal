import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";

export const runtime = "nodejs";

const BUCKET = "ktu-uploads";
// Supabase Free projects currently allow a maximum global file size of 50 MB.
// The actual project limit is enforced by Supabase Storage; keeping the API
// limit aligned prevents us from promising uploads Storage cannot accept.
const MAX_FILE_SIZE = 50 * 1024 * 1024;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase Storage is not configured. Add SUPABASE_SECRET_KEY to the deployment environment.");
  }

  return { url: url.replace(/\/$/, ""), secretKey };
}

function headers(secretKey: string, contentType = "application/json") {
  return {
    apikey: secretKey,
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

async function ensureBucket(url: string, secretKey: string) {
  // Create the bucket only when it does not already exist. Do not send a
  // bucket-level file_size_limit here: Supabase rejects a bucket limit that
  // is higher than the project's global Storage limit (for example, 50 MB on
  // Free projects), which previously caused the 413 EntityTooLarge error.
  const create = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: headers(secretKey),
    cache: "no-store",
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
    }),
  });

  if (create.ok || create.status === 409) return;

  const message = await create.text();
  throw new Error(
    `Supabase Storage bucket setup failed (${create.status}): ${message || "Check SUPABASE_SECRET_KEY and Supabase project access."}`
  );
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
      return NextResponse.json({ error: "File must be 50MB or smaller on the current Storage configuration" }, { status: 400 });
    }

    const { url, secretKey } = getSupabaseConfig();
    await ensureBucket(url, secretKey);

    const path = `admin/${safeFilename(filename)}`;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const signResponse = await fetch(
      `${url}/storage/v1/object/upload/sign/${BUCKET}/${encodedPath}`,
      {
        method: "POST",
        headers: headers(secretKey),
        body: JSON.stringify({}),
      }
    );

    if (!signResponse.ok) {
      const message = await signResponse.text();
      throw new Error(
        `Supabase signed upload failed (${signResponse.status}): ${message || "Unable to create a signed upload URL"}`
      );
    }

    const signed = await signResponse.json();
    const relativeUrl = signed.url ?? signed.signedURL ?? signed.signedUrl;
    if (!relativeUrl) {
      throw new Error("Supabase did not return a signed upload URL");
    }

    const signedUrl = new URL(relativeUrl, url).toString();
    const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${encodedPath}`;

    return NextResponse.json({ signedUrl, publicUrl, path, contentType });
  } catch (error) {
    console.error("Upload signing failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare the file upload" },
      { status: 500 }
    );
  }
}
