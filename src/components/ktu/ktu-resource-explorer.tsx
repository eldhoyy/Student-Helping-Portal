"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, FileQuestion, Search, SlidersHorizontal } from "lucide-react";
import {
  allHistoricalQuestionPaperSources,
  ktu2019LegacyIndex,
  ktu2024BranchCodes,
  ktu2024StudyIndex,
} from "@/data/ktu-study-index";

const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function KtuResourceExplorer() {
  const [query, setQuery] = useState("");
  const [scheme, setScheme] = useState<"all" | "2024" | "2019">("2024");
  const [semester, setSemester] = useState("all");
  const [branch, setBranch] = useState("all");

  const index = useMemo(() => {
    const source = scheme === "2019" ? ktu2019LegacyIndex : ktu2024StudyIndex;
    const q = normalise(query);
    return source.filter((entry) => {
      const matchesSemester = semester === "all" || entry.semester === Number(semester);
      const matchesBranch = branch === "all" || entry.branchCode === branch;
      const haystack = normalise(`${entry.branch} ${entry.branchCode} ${entry.source} ${entry.purpose} ${entry.semester} ${entry.scheme}`);
      return matchesSemester && matchesBranch && (!q || haystack.includes(q));
    });
  }, [branch, query, scheme, semester]);

  const shown = index.slice(0, 48);

  return (
    <section className="mt-10 rounded-3xl border bg-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Search the study library</p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Find notes, PYQs & study material</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search by branch, semester, scheme or resource source. Open a result to reach the verified public study catalogue.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">{index.length.toLocaleString()} matches</div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_150px_170px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ME, CSE, S3, notes, PYQ..."
            className="h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <select value={scheme} onChange={(event) => setScheme(event.target.value as typeof scheme)} className="h-11 rounded-xl border bg-background px-3 text-sm">
          <option value="2024">2024 Scheme</option>
          <option value="2019">2019 Scheme</option>
        </select>
        <select value={semester} onChange={(event) => setSemester(event.target.value)} className="h-11 rounded-xl border bg-background px-3 text-sm">
          <option value="all">All Semesters</option>
          {semesters.map((value) => <option key={value} value={value}>S{value}</option>)}
        </select>
        <select value={branch} onChange={(event) => setBranch(event.target.value)} className="h-11 rounded-xl border bg-background px-3 text-sm">
          <option value="all">All Branches</option>
          {ktu2024BranchCodes.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
        </select>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Showing {Math.min(shown.length, 48)} of {index.length} indexed study entries
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((entry, i) => (
          <a
            key={`${entry.sourceUrl}-${i}`}
            href={entry.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  {entry.purpose === "question-papers" ? <FileQuestion className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-xs font-semibold text-primary">{entry.scheme} Scheme · S{entry.semester} · {entry.branchCode}</p>
                  <h3 className="mt-0.5 font-semibold">{entry.source}</h3>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="mt-3 text-sm capitalize text-muted-foreground">{entry.purpose.replaceAll("-", " ")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{entry.branch}</p>
          </a>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No indexed source matches this search yet. Try another semester, branch or scheme.
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Question papers:</strong> historical 2024, 2019 and older papers remain available through the dedicated paper sources below. KTU Connect links to legitimate public sources rather than republishing third-party copyrighted files without permission.
        <div className="mt-3 flex flex-wrap gap-2">
          {allHistoricalQuestionPaperSources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-full border bg-background px-3 py-1.5 font-medium hover:border-primary/40 hover:text-primary">
              {source.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
