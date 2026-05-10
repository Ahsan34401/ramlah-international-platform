"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const DESKTOP_NAV: { href: string; label: string; short?: string }[] = [
  { href: "/admin/dashboard", label: "Overview", short: "Overview" },
  { href: "/admin/dashboard/jobs", label: "Jobs" },
  { href: "/admin/dashboard/applications", label: "Applications", short: "Apps" },
  { href: "/admin/dashboard/inquiries", label: "Employer inquiries", short: "Leads" },
  { href: "/admin/dashboard/blog", label: "Blog" },
  { href: "/admin/dashboard/countries", label: "Countries" },
  { href: "/admin/dashboard/settings", label: "Site settings", short: "Settings" },
];

/** Primary tabs on mobile bottom rail — rest live under “More”. */
const MOBILE_RAIL: { href: string; label: string }[] = [
  { href: "/admin/dashboard", label: "Home" },
  { href: "/admin/dashboard/jobs", label: "Jobs" },
  { href: "/admin/dashboard/applications", label: "Apps" },
  { href: "/admin/dashboard/inquiries", label: "Leads" },
];

const MOBILE_MORE_LINKS = DESKTOP_NAV.filter((n) => !MOBILE_RAIL.some((r) => r.href === n.href));

function navActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === "/admin/dashboard" || pathname === "/admin/dashboard/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navClass(active: boolean) {
  return active
    ? "border-emerald-500/80 bg-emerald-500/15 text-white"
    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white";
}

type Props = {
  email: string;
  children: React.ReactNode;
};

export function AdminDashboardShell({ email, children }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMore = useCallback(() => setMoreOpen(false), []);

  useEffect(() => {
    closeMore();
  }, [pathname, closeMore]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMore();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen, closeMore]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-2 md:px-4 md:py-2.5">
          <Link href="/admin/dashboard" className="shrink-0 leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Ramlah</span>
            <span className="hidden text-[10px] text-slate-500 md:block">Staff</span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex" aria-label="Dashboard sections">
            {DESKTOP_NAV.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${navClass(active)}`}
                >
                  {item.short ?? item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            <span className="hidden max-w-[140px] truncate text-[11px] text-slate-500 lg:inline" title={email}>
              {email}
            </span>
            <Link
              href="/"
              className="hidden rounded-md border border-white/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 hover:bg-white/10 md:inline"
            >
              Site
            </Link>
            <AdminLogoutButton className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 hover:bg-red-500/15 hover:text-red-200" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-3 pb-24 pt-3 md:px-5 md:pb-6 md:pt-4">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10 bg-slate-950/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Mobile dashboard"
      >
        {MOBILE_RAIL.map((item) => {
          const active = navActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 border-t-2 py-2 text-[10px] font-semibold uppercase tracking-wide ${
                active ? "border-emerald-400 text-emerald-400" : "border-transparent text-slate-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          className={`flex flex-1 flex-col items-center gap-0.5 border-t-2 py-2 text-[10px] font-semibold uppercase tracking-wide ${
            MOBILE_MORE_LINKS.some((m) => navActive(pathname, m.href)) ? "border-emerald-400 text-emerald-400" : "border-transparent text-slate-500"
          }`}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
        >
          More
        </button>
      </nav>

      {moreOpen ? (
        <button type="button" className="fixed inset-0 z-50 bg-black/60 md:hidden" aria-label="Close menu" onClick={closeMore} />
      ) : null}

      {moreOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-[51] max-h-[55vh] overflow-y-auto rounded-t-xl border border-white/10 bg-slate-950 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl md:hidden">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Workspace</p>
          <ul className="flex flex-col gap-1">
            {MOBILE_MORE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                  onClick={closeMore}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/10" onClick={closeMore}>
                Public site
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
