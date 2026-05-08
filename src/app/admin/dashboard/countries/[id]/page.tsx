import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCountry } from "@/app/admin/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditCountryPage({ params }: Props) {
  const { id } = await params;
  const country = await prisma.country.findUnique({ where: { id } });
  if (!country) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/dashboard/countries" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Back to countries
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Edit country</h1>
      <form action={updateCountry} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="id" value={country.id} />
        <div>
          <label className="text-xs font-medium text-slate-600">Name</label>
          <input name="name" required defaultValue={country.name} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Slug</label>
          <input name="slug" required defaultValue={country.slug} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">ISO code</label>
          <input name="code" required defaultValue={country.code} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Short blurb (optional)</label>
          <textarea name="blurb" rows={3} defaultValue={country.blurb ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Latitude</label>
            <input name="lat" type="number" step="any" required defaultValue={country.lat} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Longitude</label>
            <input name="lng" type="number" step="any" required defaultValue={country.lng} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Sort order</label>
          <input name="sortOrder" type="number" defaultValue={country.sortOrder} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" name="active" defaultChecked={country.active} className="rounded border-slate-300" />
          <label htmlFor="active" className="text-sm font-medium text-slate-700">
            Active (show on public site)
          </label>
        </div>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Update country
        </button>
      </form>
    </div>
  );
}
