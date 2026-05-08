import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
        <div>
          <p className="font-semibold text-white">Ramlah International</p>
          <p className="mt-2 text-sm">Government-approved overseas employment promoter.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/jobs" className="hover:text-emerald-400">
                Browse jobs
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-emerald-400">
                Staff dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact</p>
          <p className="mt-3 text-sm">Mailsi & Islamabad, Pakistan</p>
          <p className="text-sm">ramlahinternational@gmail.com</p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-600">© {new Date().getFullYear()} Ramlah International</p>
    </footer>
  );
}
