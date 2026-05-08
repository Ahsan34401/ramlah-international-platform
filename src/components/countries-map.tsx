"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  href: string;
};

type Props = {
  markers: MapMarker[];
  className?: string;
};

export function CountriesMap({ markers, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(ref.current).setView([28, 45], 4);
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const group: L.LatLngTuple[] = [];
    markers.forEach((m) => {
      const ll: L.LatLngTuple = [m.lat, m.lng];
      group.push(ll);
      L.marker(ll)
        .addTo(map)
        .bindPopup(`<a href="${m.href}" class="font-semibold text-emerald-800">${escapeAttr(m.label)}</a>`);
    });
    if (group.length === 1) {
      map.setView(group[0], 5);
    } else if (group.length > 1) {
      map.fitBounds(L.latLngBounds(group), { padding: [48, 48], maxZoom: 5 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [markers]);

  return <div ref={ref} className={className ?? "h-[420px] w-full rounded-2xl border border-slate-200 shadow-sm"} />;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
