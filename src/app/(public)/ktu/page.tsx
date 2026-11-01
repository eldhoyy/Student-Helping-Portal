import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, LibraryBig, Search } from "lucide-react";
import { KtuResourceExplorer } from "@/components/ktu/ktu-resource-explorer";
import { ktu2019S7S8Sources, ktu2024PrimarySources, ktuResourceSources } from "@/data/ktu-resource-sources";

export const metadata = {
  title: "KTU Study Hub",
  description: "Search KTU 2024 scheme notes, study materials, PYQs and 2019 S7-S8 resources.",
};

const sections = [
  {
    title: "2024 Scheme — Primary Layer",
    description: "2024 is the main study-material layer for S1–S8. Search the indexed branch and semester catalogue below.",
    icon: BookOpen,
    sources: ktu2024PrimarySources,
  },
  {
    title: "2019 Scheme — S7 & S8",
    description: "Legacy study material remains available primarily for S7 and S8, alongside the complete historical question-paper layer.",
    icon: LibraryBig,
    sources: ktu2019S7S8Sources,
  },
];

export default function KtuHubPage() {
  return (
    <main className="container py-8 sm:py-12">
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">KTU Connect Academic Hub</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">KTU Notes & Study Materials</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Search by scheme, semester and branch to find notes, previous question papers and study-material sources.
            2024 Scheme is prioritised for S1–S8; 2019 Scheme is retained mainly for S7 and S8.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#study-search" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <Search className="h-4 w-4" /> Search notes & materials
            </a>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold">
              <FileText className="h-4 w-4" /> Open uploaded resources
            </Link>
            <Link href="/academic" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold">
              Academic structure
            </Link>
          </div>
        </div>
      </section>

      <div id="study-search" className="scroll-mt-20">
        <KtuResourceExplorer />
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.title}>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
                </div>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.sources.map((source) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="group rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary">{source.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {source.scopes.filter((scope) => scope !== "official").slice(0, 5).map((scope) => (
                        <span key={scope} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium capitalize">{scope.replaceAll("-", " ")}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border bg-muted/30 p-6">
          <h2 className="font-display text-xl font-semibold">How the library works</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            The search index currently connects students to curated public study catalogues. Individual notes and PDFs are not copied into the repository without permission. The next database-import stage will turn verified source metadata into KTU Connect resources under Scheme → Semester → Branch → Subject → Module → Resource.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{ktuResourceSources.length} curated discovery sources are registered.</p>
        </section>
      </div>
    </main>
  );
}
