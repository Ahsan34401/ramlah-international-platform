"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

type Props = {
  propertyId: string;
  widgetId: string;
};

/**
 * Loads Tawk.to live chat once. IDs come from admin → Site settings.
 */
export function TawkEmbed({ propertyId, widgetId }: Props) {
  useEffect(() => {
    if (!propertyId || !widgetId || typeof window === "undefined") {
      return;
    }
    const id = `tawk-${propertyId}-${widgetId}`;
    if (document.getElementById(id)) {
      return;
    }
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, [propertyId, widgetId]);

  return null;
}
