import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateApplicationStatus } from "@/app/admin/actions";
import { APPLICATION_STATUSES } from "@/lib/constants";

export default async function ApplicationsPage() {
  const rows = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: { select: { title: true, slug: true } } },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="mt-1 text-slate-600">Pipeline statuses · export CSV for spreadsheets.</p>
        </div>
        <a
          href="/api/admin/export/applications"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Download CSV
        </a>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-800">
                  {r.referenceCode ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {r.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3 font-medium">{r.fullName}</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.job ? (
                    <a href={`/jobs/${r.job.slug}`} className="text-emerald-700 hover:underline">
                      {r.job.title}
                    </a>
                  ) : (
                    <span className="text-slate-400">General</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{r.email}</div>
                  <div className="text-xs">{r.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <form action={updateApplicationStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <select
                      name="status"
                      defaultValue={r.status === "NEW" ? "RECEIVED" : r.status}
                      className="max-w-[160px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dashboard/applications/${r.id}`} className="text-emerald-700 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No applications yet.</p>
        ) : null}
      </div>
    </div>
  );
}
