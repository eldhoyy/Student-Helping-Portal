import Link from "next/link";
import { Search, BookOpen, Bell, Download, Compass, Calendar, ArrowRight, GraduationCap, Sparkles, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/shared/resource-card";
import { NoticeListItem } from "@/components/shared/notice-list-item";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getRuntimeDictionary } from "@/lib/i18n";

export default async function HomePage() {
  const dict = await getRuntimeDictionary("en");

  const quickLinks = [
    { href: "/resources", label: dict.home.quickLinks.resources, icon: BookOpen, tone: "bg-blue-50 text-blue-700" },
    { href: "/notices", label: dict.home.quickLinks.notices, icon: Bell, tone: "bg-cyan-50 text-cyan-700" },
    { href: "/downloads", label: dict.home.quickLinks.downloads, icon: Download, tone: "bg-emerald-50 text-emerald-700" },
    { href: "/guides", label: dict.home.quickLinks.guides, icon: Compass, tone: "bg-violet-50 text-violet-700" },
    { href: "/academic", label: dict.home.quickLinks.academic, icon: Calendar, tone: "bg-amber-50 text-amber-700" },
  ];

  const [notices, popularResources, latestArticles] = await Promise.all([
    prisma.notice.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishDate: "desc" }, take: 5 }),
    prisma.resource.findMany({ where: { status: "PUBLISHED" }, include: { category: true, department: true }, orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }], take: 6 }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <div className="overflow-hidden">
      <section className="relative border-b bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(6,182,212,0.22),transparent_32%)]" />
        <div className="relative container py-16 md:py-24 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur">
                <Sparkles className="h-4 w-4" /> KTU Connect · Student Ecosystem
              </div>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {dict.home.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {dict.home.description}
              </p>

              <form action="/search" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input name="q" placeholder="Search S3 ME notes, PYQs, notices, syllabus…" className="h-12 rounded-xl border-white/10 bg-white text-slate-900 pl-11 shadow-xl placeholder:text-slate-400" />
                </div>
                <Button type="submit" size="lg" className="h-12 rounded-xl bg-blue-600 px-7 text-white hover:bg-blue-500">{dict.home.search}</Button>
              </form>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Built for KTU students</span>
                <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-cyan-300" /> S1–S8 academic structure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-6 relative z-10 pb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="group flex min-h-32 flex-col justify-between rounded-2xl border bg-card p-5 shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${link.tone}`}><Icon className="h-5 w-5" /></div>
                <span className="mt-5 text-sm font-semibold group-hover:text-primary">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container py-10 lg:py-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Discover</p><h2 className="mt-1 font-display text-2xl font-semibold">{dict.home.popularResources}</h2></div>
            <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">{dict.home.viewAll} <ArrowRight className="inline h-3.5 w-3.5" /></Link>
          </div>
          {popularResources.length > 0 ? <div className="grid gap-5 sm:grid-cols-2">{popularResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div> : <EmptyState icon={BookOpen} title={dict.home.noResources} description={dict.home.noResourcesDescription} />}
        </div>

        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Stay updated</p><h2 className="mt-1 font-display text-2xl font-semibold">{dict.home.latestNotices}</h2></div>
            <Link href="/notices" className="text-sm font-semibold text-primary hover:underline">All <ArrowRight className="inline h-3.5 w-3.5" /></Link>
          </div>
          {notices.length > 0 ? <div className="space-y-3">{notices.map((notice) => <NoticeListItem key={notice.id} notice={notice} />)}</div> : <EmptyState icon={Bell} title={dict.home.noNotices} description={dict.home.noNoticesDescription} />}
        </div>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="container py-12 pb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">From KTU Connect</p><h2 className="mt-1 font-display text-2xl font-semibold">{dict.home.latestArticles}</h2></div>
            <Link href="/articles" className="text-sm font-semibold text-primary hover:underline">{dict.home.viewAll} <ArrowRight className="inline h-3.5 w-3.5" /></Link>
          </div>
          {latestArticles.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{latestArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : <EmptyState icon={Compass} title={dict.home.noArticles} description={dict.home.noArticlesDescription} />}
        </div>
      </section>
    </div>
  );
}
