import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [jobs, applications, inquiries] = await Promise.all([
    prisma.job.count(),
    prisma.jobApplication.count(),
    prisma.employerInquiry.count(),
  ]);
  const newApps = await prisma.jobApplication.count({ where: { status: "NEW" } });
  const newInq = await prisma.employerInquiry.count({ where: { status: "NEW" } });

  const cards = [
    { label: "Total jobs", value: jobs },
    { label: "Applications", value: applications, hint: `${newApps} new` },
    { label: "Employer leads", value: inquiries, hint: `${newInq} new` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mt-1 text-slate-600">Operational snapshot — all data is stored in your database (SQLite locally).</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{c.value}</p>
            {c.hint ? <p className="mt-1 text-xs text-emerald-700">{c.hint}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
