import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ResourceCard } from "@/components/shared/resource-card";
import { ResourceFilterLink } from "@/components/shared/resource-filter-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { resourceTypeMeta } from "@/lib/content-meta";
import type { ResourceType } from "@prisma/client";

const PAGE_SIZE = 12;

interface SearchParamsShape {
  category?: string;
  department?: string;
  type?: string;
  page?: string;
}

export const metadata = { title: "Study Resources" };

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsShape>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(params.category ? { categoryId: params.category } : {}),
    ...(params.department ? { departmentId: params.department } : {}),
    ...(params.type ? { resourceType: params.type as ResourceType } : {}),
  };

  const [resources, total, categories, departments] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: { category: true, department: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.resource.count({ where }),
    prisma.category.findMany({ where: { type: "RESOURCE" }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildHref(overrides: Partial<SearchParamsShape>) {
    const merged = { ...params, ...overrides };
    const sp = new URLSearchParams();
    if (merged.category) sp.set("category", merged.category);
    if (merged.department) sp.set("department", merged.department);
    if (merged.type) sp.set("type", merged.type);
    if (merged.page && merged.page !== "1") sp.set("page", merged.page);
    const qs = sp.toString();
    return `/resources${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Study Resources</h1>
        <p className="text-muted-foreground mt-1">
          Notes, books, previous questions, assignments, and video tutorials for every department.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2.5">Resource Type</h3>
            <div className="flex flex-wrap gap-2">
              <ResourceFilterLink href={buildHref({ type: undefined, page: undefined })} active={!params.type}>
                All
              </ResourceFilterLink>
              {Object.entries(resourceTypeMeta).map(([key, meta]) => (
                <ResourceFilterLink key={key} href={buildHref({ type: key, page: undefined })} active={params.type === key}>
                  {meta.label}
                </ResourceFilterLink>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2.5">Category</h3>
              <div className="flex flex-wrap gap-2">
                <ResourceFilterLink href={buildHref({ category: undefined, page: undefined })} active={!params.category}>
                  All
                </ResourceFilterLink>
                {categories.map((cat) => (
                  <ResourceFilterLink key={cat.id} href={buildHref({ category: cat.id, page: undefined })} active={params.category === cat.id}>
                    {cat.name}
                  </ResourceFilterLink>
                ))}
              </div>
            </div>
          )}

          {departments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2.5">Department</h3>
              <div className="flex flex-wrap gap-2">
                <ResourceFilterLink href={buildHref({ department: undefined, page: undefined })} active={!params.department}>
                  All
                </ResourceFilterLink>
                {departments.map((dept) => (
                  <ResourceFilterLink key={dept.id} href={buildHref({ department: dept.id, page: undefined })} active={params.department === dept.id}>
                    {dept.name}
                  </ResourceFilterLink>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="min-w-0">
          {resources.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="card-motion">
                    <ResourceCard resource={resource} />
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={(p) => buildHref({ page: p === 1 ? undefined : String(p) })}
              />
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No resources found"
              description="Try adjusting your filters or check back later for new resources."
            />
          )}
        </div>
      </div>
    </div>
  );
}
