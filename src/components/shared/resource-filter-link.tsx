"use client";

import Link, { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";

function FilterLinkContent({ active, children }: { active: boolean; children: React.ReactNode }) {
  const { pending } = useLinkStatus();

  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium resource-filter-control",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
        pending && "resource-filter-pending"
      )}
      aria-busy={pending}
    >
      {children}
      {pending && <span className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />}
    </span>
  );
}

export function ResourceFilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} scroll={false} prefetch>
      <FilterLinkContent active={active}>{children}</FilterLinkContent>
    </Link>
  );
}
