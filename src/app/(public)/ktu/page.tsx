import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, LibraryBig, Search } from "lucide-react";
import { ktu2019S7S8Sources, ktu2024PrimarySources, ktuResourceSources } from "@/data/ktu-resource-sources";

export const metadata = {
  title: "KTU Study Hub",
  description: "KTU 2024 scheme study resources, notes, PYQs and official syllabus sources.",
};

const sections = [
  {
    title: "2024 Scheme — Primary Layer",
    description: "The main study-material layer. Use 2024 scheme resources for S1–S8 wherever verified material is available.",
    icon: BookOpen,
    sources: ktu2024PrimarySources,
  },
  {
    title: "2019 Scheme — S7 & S8",
    description: "Dedicated legacy coverage for the semesters that still need 2019-scheme notes and study material.",
    icon: LibraryBig,
    sources: ktu2019S7S8Sources,
  },
];

export default function KtuHubPage() {
  return (
    <main className="container py-10 sm:py-14">
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">KTU Connect Academic Hub</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            One organised place for KTU study resources.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            2024 Scheme is the default academic layer. 2019 Scheme is retained primarily for S7 and S8, while every
            available previous question paper is kept searchable across schemes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <Search className="h-4 w-4" /> Browse resources
            </Link>
            <Link href="/academic" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold">
              <FileText className="h-4 w-4" /> Academic structure
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-10">
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
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary">{source.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {source.scopes.filter((scope) => scope !== "official").slice(0, 5).map((scope) => (
                        <span key={scope} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium capitalize">
                          {scope.replaceAll("-", " ")}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border border-dashed p-6">
          <h2 className="font-display text-xl font-semibold">Question-paper policy</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Question papers are scheme-independent in the catalogue: 2024, 2019 and older papers can coexist for the
            same subject where useful. The database will retain scheme metadata so students can filter by scheme and
            still see the complete historical paper set.
          </p>
        </section>

        <section className="rounded-2xl border bg-muted/30 p-6">
          <h2 className="font-display text-xl font-semibold">Connected discovery sources</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {ktuResourceSources.length} curated source endpoints are registered for the future metadata importer.
            KTU Connect should index metadata and legitimate links rather than silently copying third-party copyrighted files.
          </p>
        </section>
      </div>
    </main>
  );
}
