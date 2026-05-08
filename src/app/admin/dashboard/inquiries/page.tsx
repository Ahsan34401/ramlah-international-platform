import { prisma } from "@/lib/prisma";
import { updateInquiryNote, updateInquiryStatus } from "@/app/admin/actions";
import { INQUIRY_STATUSES } from "@/lib/constants";

export default async function InquiriesPage() {
  const rows = await prisma.employerInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employer inquiries</h1>
          <p className="mt-1 text-slate-600">B2B leads · internal notes are not shown publicly.</p>
        </div>
        <a
          href="/api/admin/export/inquiries"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Download CSV
        </a>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Need</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Internal note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="align-top hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {r.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3 font-medium">{r.companyName}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{r.contactName}</div>
                  <div className="text-xs">{r.email}</div>
                  <div className="text-xs">{r.phone}</div>
                </td>
                <td className="max-w-xs px-4 py-3 text-slate-600">
                  <div className="text-xs text-slate-500">
                    {[r.country, r.sector, r.workersNeeded].filter(Boolean).join(" · ")}
                  </div>
                  {r.message ? <p className="mt-1 line-clamp-3 text-xs">{r.message}</p> : null}
                </td>
                <td className="px-4 py-3">
                  <form action={updateInquiryStatus} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <select
                      name="status"
                      defaultValue={r.status}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                    >
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Save status
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={updateInquiryNote} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <textarea
                      name="internalNote"
                      rows={2}
                      defaultValue={r.internalNote ?? ""}
                      placeholder="Team notes…"
                      className="w-48 max-w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Save note
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No inquiries yet.</p>
        ) : null}
      </div>
    </div>
  );
}
