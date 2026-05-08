import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobApplyForm } from "@/components/job-apply-form";
import { publishedJobWhere } from "@/lib/job-public";

type Props = { params: Promise<{ slug: string }> };

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await prisma.job.findFirst({
    where: { slug, ...publishedJobWhere() },
  });
  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link href="/jobs" className="text-sm font-medium text-emerald-700 hover:underline">
        ← All jobs
      </Link>
      <article className="mt-6 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            {job.featured ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase text-amber-900">
                Featured
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-slate-600">{[job.country, job.sector].filter(Boolean).join(" · ")}</p>
          {job.salaryHint ? <p className="mt-4 text-sm font-semibold text-emerald-800">{job.salaryHint}</p> : null}
          {job.expiresAt ? (
            <p className="mt-2 text-xs text-amber-800">Listing active until {job.expiresAt.toISOString().slice(0, 10)}</p>
          ) : null}
          {job.summary ? <p className="mt-6 text-lg text-slate-700">{job.summary}</p> : null}
          {job.description ? (
            <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-slate-600">{job.description}</div>
          ) : null}
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">Apply for this role</h2>
            <p className="mt-1 text-sm text-slate-500">Upload CV (PDF/DOC). You will receive a reference code after submit.</p>
            <div className="mt-6">
              <JobApplyForm jobId={job.id} defaultCategory={job.sector ?? undefined} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
