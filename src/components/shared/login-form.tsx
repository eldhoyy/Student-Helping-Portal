"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLabels {
  welcomeBack: string;
  loginDescription: string;
  invalidCredentials: string;
  genericError: string;
  email: string;
  password: string;
  login: string;
  noAccount: string;
  signup: string;
}

export function LoginForm({ labels }: { labels: AuthLabels }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const requestedCallback = searchParams.get("callbackUrl");
      const result = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" || result.error === "CallbackRouteError" ? labels.invalidCredentials : result.error);
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await sessionResponse.json();
      const isAdmin = session?.user?.role === "ADMIN";
      const destination = isAdmin ? (requestedCallback || "/admin") : "/";

      router.replace(destination);
      router.refresh();
    } catch {
      setError(labels.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-white/60 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur">
      <CardHeader className="space-y-2"><CardTitle className="font-display text-3xl">{labels.welcomeBack}</CardTitle><CardDescription>{labels.loginDescription}</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-2"><Label htmlFor="email">{labels.email}</Label><Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" className="h-11 rounded-xl" /></div>
          <div className="space-y-2"><Label htmlFor="password">{labels.password}</Label><Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" autoComplete="current-password" className="h-11 rounded-xl" /></div>
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}{loading ? "Signing in…" : labels.login}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">{labels.noAccount}{" "}<Link href="/register" className="text-primary font-semibold hover:underline">{labels.signup}</Link></p>
      </CardContent>
    </Card>
  );
}
