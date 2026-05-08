import Link from "next/link";
import { createJob } from "@/app/admin/actions";

export default function NewJobPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/dashboard/jobs" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Back to jobs
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">New job posting</h1>
      <form action={createJob} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs font-medium text-slate-600">Title</label>
          <input name="title" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Slug (URL)</label>
          <input
            name="slug"
            required
            placeholder="e.g. electrician-riyadh"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Summary</label>
          <textarea name="summary" rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Full description</label>
          <textarea name="description" rows={5} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Country</label>
            <input name="country" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Sector</label>
            <input name="sector" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Salary / package hint</label>
          <input name="salaryHint" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Listing expiry (optional)</label>
          <input name="expiresAt" type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" name="featured" value="true" className="rounded border-slate-300" />
          <label htmlFor="featured" className="text-sm font-medium text-slate-700">
            Featured (shows at top of /jobs)
          </label>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select name="status" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Save job
        </button>
      </form>
    </div>
  );
}
