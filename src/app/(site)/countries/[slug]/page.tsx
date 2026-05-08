import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicJobOrderBy, publishedJobWhere } from "@/lib/job-public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = await prisma.country.findFirst({ where: { slug, active: true } });
  if (!country) {
    return { title: "Country" };
  }
  return {
    title: `${country.name} | Ramlah International`,
    description: country.blurb ?? `Overseas opportunities in ${country.name}.`,
  };
}

export default async function CountryDetailPage({ params }: Props) {
  const { slug } = await params;
  const country = await prisma.country.findFirst({ where: { slug, active: true } });
  if (!country) {
    notFound();
  }

  const jobFilters: Prisma.JobWhereInput[] = [
    publishedJobWhere(),
    {
      OR: [{ country: { contains: country.name } }, { country: { contains: country.code } }],
    },
  ];

  const jobs = await prisma.job.findMany({
    where: { AND: jobFilters },
    orderBy: publicJobOrderBy,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link href="/countries" className="text-sm font-semibold text-emerald-700 hover:underline">
        ← All countries
      </Link>
      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{country.name}</h1>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{country.code}</span>
      </div>
      {country.blurb ? <p className="mt-4 max-w-2xl text-lg text-slate-600">{country.blurb}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/jobs?country=${encodeURIComponent(country.name)}`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Filter jobs by this country
        </Link>
      </div>

      <h2 className="mt-14 text-xl font-bold text-slate-900">Matching open roles</h2>
      <p className="mt-1 text-sm text-slate-600">Listings whose market field mentions this country or its code.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {jobs.map((j) => (
          <Link
            key={j.id}
            href={`/jobs/${j.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <h3 className="text-lg font-bold group-hover:text-emerald-800">{j.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{[j.country, j.sector].filter(Boolean).join(" · ")}</p>
            {j.summary ? <p className="mt-3 line-clamp-2 text-sm text-slate-600">{j.summary}</p> : null}
          </Link>
        ))}
      </div>
      {jobs.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No published jobs match this country yet — browse{" "}
          <Link href="/jobs" className="font-semibold text-emerald-700 hover:underline">
            all jobs
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
