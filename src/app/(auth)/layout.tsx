import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.32),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.18),transparent_30%)]" />
      <div className="relative z-10 mb-7 text-center text-white">
        <Link href="/" className="inline-flex items-center gap-3 text-2xl font-bold tracking-tight">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/40"><GraduationCap className="h-6 w-6" /></span>
          KTU Connect
        </Link>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-300"><ShieldCheck className="h-4 w-4 text-cyan-300" /> KTU student ecosystem</p>
      </div>
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
