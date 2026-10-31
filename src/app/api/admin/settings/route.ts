import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { siteSettingSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  let settings = await prisma.siteSetting.findFirst();
  if (!settings) settings = await prisma.siteSetting.create({ data: { siteName: "KTU Connect", siteLanguage: "en" } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = siteSettingSchema.safeParse({ ...(await Promise.resolve(body)), siteLanguage: "en", siteName: "KTU Connect" });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const existing = await prisma.siteSetting.findFirst();
  const data = {
    ...parsed.data,
    siteName: "KTU Connect",
    siteLanguage: "en",
    logoUrl: parsed.data.logoUrl || null,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    facebookUrl: parsed.data.facebookUrl || null,
    twitterUrl: parsed.data.twitterUrl || null,
    linkedinUrl: parsed.data.linkedinUrl || null,
    youtubeUrl: parsed.data.youtubeUrl || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
  };

  const settings = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data })
    : await prisma.siteSetting.create({ data });

  return NextResponse.json({ settings });
}
