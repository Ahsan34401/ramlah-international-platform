"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/countries-map";

const CountriesMap = dynamic(() => import("@/components/countries-map").then((m) => m.CountriesMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

type Props = {
  markers: MapMarker[];
};

export function CountriesMapSection({ markers }: Props) {
  return <CountriesMap markers={markers} />;
}
