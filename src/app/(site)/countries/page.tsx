import Link from "next/link";
import type { Metadata } from "next";
import { CountriesMapSection } from "@/components/countries-map-section";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Destination countries | Ramlah International",
  description: "Markets we recruit for — explore locations and open roles.",
};

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const markers = countries.map((c) => ({
    lat: c.lat,
    lng: c.lng,
    label: c.name,
    href: `/countries/${c.slug}`,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Destination countries</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Tap a marker or choose a country below to read a short market note and see matching job listings.
      </p>

      {markers.length > 0 ? (
        <div className="mt-10">
          <CountriesMapSection markers={markers} />
        </div>
      ) : null}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <Link
            key={c.id}
            href={`/countries/${c.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <h2 className="font-bold text-slate-900">{c.name}</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{c.code}</p>
            {c.blurb ? <p className="mt-3 line-clamp-3 text-sm text-slate-600">{c.blurb}</p> : null}
          </Link>
        ))}
      </div>
      {countries.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">No countries configured yet.</p>
      ) : null}
    </div>
  );
}
