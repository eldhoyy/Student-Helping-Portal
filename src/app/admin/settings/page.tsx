"use client";

import * as React from "react";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileUploadField } from "@/components/shared/file-upload-field";
import { useToast } from "@/components/ui/use-toast";

const emptyForm = {
  siteName: "KTU Connect",
  siteLanguage: "en",
  logoUrl: "",
  contactEmail: "admin@ktuconnect.in",
  phone: "",
  address: "Kerala, India",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  seoTitle: "KTU Connect — Kerala Technical University Student Ecosystem",
  seoDescription: "KTU Connect is a student-first academic ecosystem for KTU students.",
};

export default function AdminSettingsPage() {
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function load() {
      try {
        const settingsRes = await fetch("/api/admin/settings");
        const settingsData = await settingsRes.json();
        const s = settingsData.settings ?? {};
        setForm({
          siteName: "KTU Connect",
          siteLanguage: "en",
          logoUrl: s.logoUrl ?? "",
          contactEmail: s.contactEmail ?? emptyForm.contactEmail,
          phone: s.phone ?? "",
          address: s.address ?? emptyForm.address,
          facebookUrl: s.facebookUrl ?? "",
          twitterUrl: s.twitterUrl ?? "",
          linkedinUrl: s.linkedinUrl ?? "",
          youtubeUrl: s.youtubeUrl ?? "",
          seoTitle: s.seoTitle ?? emptyForm.seoTitle,
          seoDescription: s.seoDescription ?? emptyForm.seoDescription,
        });
      } catch {
        toast({ title: "Failed to load settings", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      toast({ title: "Settings saved", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Something went wrong", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <div><h1 className="font-display text-2xl font-semibold">KTU Connect Settings</h1><p className="text-sm text-muted-foreground">Configure the platform identity, contact details, social links, and SEO.</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle className="text-lg">Platform Identity</CardTitle><CardDescription>KTU Connect is the fixed platform identity.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="siteName">Site Name</Label><Input id="siteName" value="KTU Connect" readOnly /></div>
            <FileUploadField id="logoUrl" label="Logo" value={form.logoUrl} onChange={(value) => setForm((f) => ({ ...f, logoUrl: value }))} accept="image/*" />
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle className="text-lg">Contact Information</CardTitle><CardDescription>Displayed on the contact page and footer.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" type="email" required value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="address">Address</Label><Textarea id="address" rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></div>
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle className="text-lg">Social Links</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="facebookUrl">Facebook URL</Label><Input id="facebookUrl" type="url" value={form.facebookUrl} onChange={(e) => setForm((f) => ({ ...f, facebookUrl: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label htmlFor="twitterUrl">Twitter / X URL</Label><Input id="twitterUrl" type="url" value={form.twitterUrl} onChange={(e) => setForm((f) => ({ ...f, twitterUrl: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label htmlFor="linkedinUrl">LinkedIn URL</Label><Input id="linkedinUrl" type="url" value={form.linkedinUrl} onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label htmlFor="youtubeUrl">YouTube URL</Label><Input id="youtubeUrl" type="url" value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} /></div>
        </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-lg">SEO</CardTitle><CardDescription>Default metadata for search engines.</CardDescription></CardHeader><CardContent className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="seoTitle">SEO Title</Label><Input id="seoTitle" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label htmlFor="seoDescription">SEO Description</Label><Textarea id="seoDescription" rows={3} value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} /></div>
        </CardContent></Card>

        <Separator />
        <Button type="submit" disabled={saving} size="lg">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Settings</Button>
      </form>
    </div>
  );
}
