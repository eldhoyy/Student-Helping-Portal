import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const LANGUAGE_COOKIE_NAME = "site_language";
export type SiteLanguage = "en";

export type SiteSettingsSnapshot = {
  siteName: string;
  siteLanguage: SiteLanguage;
  logoUrl: string | null;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

const defaultSettings: SiteSettingsSnapshot = {
  siteName: "KTU Connect",
  siteLanguage: "en",
  logoUrl: null,
  contactEmail: "admin@ktuconnect.in",
  phone: null,
  address: "Kerala, India",
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
  seoTitle: "KTU Connect — Kerala Technical University Student Ecosystem",
  seoDescription: "KTU Connect is a student-first academic ecosystem for KTU students to find resources, notices, exams, academic information and opportunities.",
};

export const getSiteSettings = cache(async (): Promise<SiteSettingsSnapshot> => {
  try {
    const settings = await prisma.siteSetting.findFirst({
      select: {
        logoUrl: true,
        contactEmail: true,
        phone: true,
        address: true,
        facebookUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        seoTitle: true,
        seoDescription: true,
      },
    });

    if (!settings) return defaultSettings;

    return {
      ...defaultSettings,
      logoUrl: settings.logoUrl,
      contactEmail: settings.contactEmail || defaultSettings.contactEmail,
      phone: settings.phone,
      address: settings.address || defaultSettings.address,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      linkedinUrl: settings.linkedinUrl,
      youtubeUrl: settings.youtubeUrl,
      seoTitle: settings.seoTitle || defaultSettings.seoTitle,
      seoDescription: settings.seoDescription || defaultSettings.seoDescription,
    };
  } catch {
    return defaultSettings;
  }
});

export function getActiveLanguages() {
  return [{ code: "en", name: "English", nativeName: "English", isDefault: true }];
}

export function getCurrentLanguage(): SiteLanguage {
  return "en";
}
