import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

const nav = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/jobs", label: "Jobs" },
  { href: "/admin/dashboard/applications", label: "Applications" },
  { href: "/admin/dashboard/inquiries", label: "Employer inquiries" },
  { href: "/admin/dashboard/blog", label: "Blog" },
  { href: "/admin/dashboard/countries", label: "Countries" },
  { href: "/admin/dashboard/settings", label: "Site settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-slate-100">
          <div className="border-b border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Ramlah</p>
            <p className="mt-1 truncate text-sm text-slate-400">{session.email}</p>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 p-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-2">
            <LogoutButton />
            <Link href="/" className="mt-2 block rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-white">
              ← Public site
            </Link>
          </div>
        </aside>
        <main className="min-h-screen flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
