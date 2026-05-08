import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { duplicateJob } from "@/app/admin/actions";
import { DeleteJobButton } from "./delete-job-button";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="mt-1 text-slate-600">Featured jobs sort first on the public listing. Expired listings hide automatically.</p>
        </div>
        <Link
          href="/admin/dashboard/jobs/new"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500"
        >
          + New job
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="font-medium">{j.title}</div>
                  <div className="text-xs text-slate-500">/{j.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      j.status === "PUBLISHED"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                    }
                  >
                    {j.status}
                  </span>
                </td>
                <td className="px-4 py-3">{j.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {[j.country, j.sector].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {j.expiresAt ? j.expiresAt.toISOString().slice(0, 10) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/dashboard/jobs/${j.id}/edit`}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={duplicateJob}>
                      <input type="hidden" name="id" value={j.id} />
                      <button type="submit" className="text-xs font-semibold text-slate-600 hover:underline">
                        Duplicate
                      </button>
                    </form>
                    <DeleteJobButton id={j.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No jobs — create one.</p>
        ) : null}
      </div>
    </div>
  );
}
