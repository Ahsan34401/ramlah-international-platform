import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateApplicationStatus } from "@/app/admin/actions";
import { APPLICATION_STATUSES } from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const r = await prisma.jobApplication.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!r) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/dashboard/applications" className="text-sm font-medium text-emerald-700 hover:underline">
        ← All applications
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{r.fullName}</h1>
      <p className="font-mono text-sm text-emerald-800">{r.referenceCode ?? "No reference"}</p>

      <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <span className="text-slate-500">Email</span>
            <p className="font-medium">{r.email}</p>
          </div>
          <div>
            <span className="text-slate-500">Phone</span>
            <p className="font-medium">{r.phone}</p>
          </div>
          <div>
            <span className="text-slate-500">CNIC</span>
            <p className="font-medium">{r.cnic ?? "—"}</p>
          </div>
          <div>
            <span className="text-slate-500">Category</span>
            <p className="font-medium">{r.category ?? "—"}</p>
          </div>
          <div>
            <span className="text-slate-500">Experience (yrs)</span>
            <p className="font-medium">{r.experienceYears ?? "—"}</p>
          </div>
          <div>
            <span className="text-slate-500">Expected salary</span>
            <p className="font-medium">{r.expectedSalary ?? "—"}</p>
          </div>
          <div>
            <span className="text-slate-500">Available from</span>
            <p className="font-medium">{r.availableFrom ? r.availableFrom.toISOString().slice(0, 10) : "—"}</p>
          </div>
          <div>
            <span className="text-slate-500">Job</span>
            <p className="font-medium">
              {r.job ? (
                <Link href={`/jobs/${r.job.slug}`} className="text-emerald-700 hover:underline">
                  {r.job.title}
                </Link>
              ) : (
                "General"
              )}
            </p>
          </div>
        </div>
        {r.skills ? (
          <div>
            <span className="text-slate-500">Skills</span>
            <p className="mt-1 whitespace-pre-wrap">{r.skills}</p>
          </div>
        ) : null}
        {r.message ? (
          <div>
            <span className="text-slate-500">Notes</span>
            <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
          </div>
        ) : null}
        {r.coverLetter ? (
          <div>
            <span className="text-slate-500">Cover letter</span>
            <p className="mt-1 whitespace-pre-wrap">{r.coverLetter}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-2">
          {r.cvPath ? (
            <a
              href={`/api/admin/applications/${r.id}/file?t=cv`}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Download CV
            </a>
          ) : null}
          {r.photoPath ? (
            <a
              href={`/api/admin/applications/${r.id}/file?t=photo`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              Download photo
            </a>
          ) : null}
        </div>
      </div>

      <form action={updateApplicationStatus} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input type="hidden" name="id" value={r.id} />
        <label className="text-sm font-medium text-slate-600">Update status</label>
        <select
          name="status"
          defaultValue={r.status === "NEW" ? "RECEIVED" : r.status}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
          Save
        </button>
      </form>
    </div>
  );
}
