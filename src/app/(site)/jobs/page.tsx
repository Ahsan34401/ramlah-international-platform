import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publicJobOrderBy, publishedJobWhere } from "@/lib/job-public";

type Props = { searchParams: Promise<{ q?: string; country?: string; sector?: string }> };

export default async function JobsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const country = (sp.country ?? "").trim();
  const sector = (sp.sector ?? "").trim();

  const filters: Prisma.JobWhereInput[] = [publishedJobWhere()];
  if (q) {
    filters.push({
      OR: [
        { title: { contains: q } },
        { summary: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }
  if (country) {
    filters.push({ country: { contains: country } });
  }
  if (sector) {
    filters.push({ sector: { contains: sector } });
  }

  const jobs = await prisma.job.findMany({
    where: { AND: filters },
    orderBy: publicJobOrderBy,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Open opportunities</h1>
      <p className="mt-2 text-slate-600">
        Published roles — featured listings appear first. Apply online; every submission gets a reference code.
      </p>

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title or keywords"
          className="rounded-xl border border-slate-200 px-3 py-2 md:col-span-2"
        />
        <input name="country" defaultValue={country} placeholder="Country" className="rounded-xl border border-slate-200 px-3 py-2" />
        <input name="sector" defaultValue={sector} placeholder="Sector" className="rounded-xl border border-slate-200 px-3 py-2" />
        <div className="flex gap-2 md:col-span-4">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Filter
          </button>
          <Link href="/jobs" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {jobs.map((j) => (
          <Link
            key={j.id}
            href={`/jobs/${j.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold group-hover:text-emerald-800">{j.title}</h2>
              {j.featured ? (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                  Featured
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-500">{[j.country, j.sector].filter(Boolean).join(" · ")}</p>
            {j.summary ? <p className="mt-3 line-clamp-3 text-sm text-slate-600">{j.summary}</p> : null}
            {j.salaryHint ? <p className="mt-3 text-xs font-medium text-emerald-700">{j.salaryHint}</p> : null}
          </Link>
        ))}
      </div>
      {jobs.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">No matching jobs — try different filters or check back soon.</p>
      ) : null}
    </div>
  );
}
