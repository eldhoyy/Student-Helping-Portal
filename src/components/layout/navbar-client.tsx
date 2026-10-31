"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, Search, User, LayoutDashboard, LogOut, Shield } from "lucide-react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarLabels {
  dashboard: string;
  adminPanel: string;
  profile: string;
  login: string;
  signup: string;
  logout: string;
  searchPlaceholder: string;
  mobileSearchPlaceholder: string;
  toggleMenu: string;
}

export function NavbarClient({
  links,
  session,
  labels,
}: {
  links: NavLink[];
  session: Session | null;
  labels: NavbarLabels;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => setOpen(false), [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <>
      <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname === link.href && "text-primary"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2.5">
        <form onSubmit={handleSearch} className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="w-44 lg:w-52 pl-8 h-9 rounded-xl" />
        </form>

        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                  {session.user.image && <AvatarImage src={session.user.image} alt={session.user.name ?? "User"} />}
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="font-semibold">{session.user.name}</p>
                <p className="text-xs text-muted-foreground font-normal truncate">{session.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />{labels.dashboard}</Link>
              </DropdownMenuItem>
              {session.user.role === "ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin"><Shield className="mr-2 h-4 w-4" />{labels.adminPanel}</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" />{labels.profile}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />{labels.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link href="/login">{labels.login}</Link></Button>
            <Button size="sm" className="rounded-lg" asChild><Link href="/register">{labels.signup}</Link></Button>
          </div>
        )}

        <Button variant="ghost" size="icon" className="lg:hidden rounded-xl" onClick={() => setOpen((v) => !v)} aria-label={labels.toggleMenu}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 border-b bg-background p-4 shadow-xl">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.mobileSearchPlaceholder} className="pl-8 rounded-xl" />
          </form>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary">{link.label}</Link>
            ))}
          </div>
          {!session?.user && (
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" asChild><Link href="/login">{labels.login}</Link></Button>
              <Button className="flex-1 rounded-xl" asChild><Link href="/register">{labels.signup}</Link></Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
