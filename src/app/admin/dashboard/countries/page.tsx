import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCountry } from "@/app/admin/actions";

export default async function AdminCountriesPage() {
  const rows = await prisma.country.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
          <p className="mt-1 text-slate-600">Shown on the public map and country pages. Coordinates power Leaflet markers.</p>
        </div>
        <Link
          href="/admin/dashboard/countries/new"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500"
        >
          + New country
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Lat / Lng</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-slate-500">/{c.slug}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                <td className="px-4 py-3">{c.active ? "Yes" : "No"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/admin/dashboard/countries/${c.id}`} className="text-xs font-semibold text-emerald-700 hover:underline">
                      Edit
                    </Link>
                    <form action={deleteCountry} className="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="p-8 text-center text-slate-500">No countries — add one or run seed.</p> : null}
      </div>
    </div>
  );
}
