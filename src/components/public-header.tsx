import Link from "next/link";

const links = [
  ["About", "/#about"],
  ["Jobs", "/jobs"],
  ["Countries", "/countries"],
  ["Blog", "/blog"],
  ["Track", "/track-application"],
  ["Employers", "/#employers"],
  ["Contact", "/#contact"],
];

type Props = {
  license?: string;
};

export function PublicHeader({ license }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-wide text-white">Ramlah International</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400/90">
            Licensed OEP · {license ?? "OPE.HRD3789/MTN2015"}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            Staff login
          </Link>
        </nav>
      </div>
    </header>
  );
}
