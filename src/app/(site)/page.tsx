import Link from "next/link";
import { EmployerInquiryForm } from "@/components/employer-inquiry-form";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30h60M30 0v60' fill='none' stroke='rgba(255,255,255,0.06)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Pakistan → GCC · Europe · Global</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Trusted manpower. Ethical recruitment.{" "}
              <span className="text-emerald-400">Full compliance.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Government-licensed OEP (OPE.HRD3789/MTN2015). Right person for the right job — screening to deployment with
              clear guarantees.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400"
              >
                Browse overseas jobs
              </Link>
              <a
                href="#employers"
                className="rounded-2xl border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Request talent (employers)
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">45–60 day mobilization</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">90-day replacement</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">POEPA · Embassy registered</span>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-lg font-bold text-white">Why global employers choose Ramlah</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-0.5 text-emerald-400">✓</span>
                Structured selection: practical tests, medicals, briefing, documentation.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-emerald-400">✓</span>
                Transparent process aligned with Pakistan overseas employment regulations.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-emerald-400">✓</span>
                Broad trade coverage — construction, hospitality, healthcare, logistics, and more.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tight">About Ramlah International</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Ramlah International Overseas Employment Promoters is a leading manpower recruitment company in Pakistan, connecting
          global employers with skilled, semi-skilled, and unskilled talent — with precise management, careful selection, and
          timely deployment.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-emerald-800">Mission</h3>
            <p className="mt-2 text-slate-600">
              Ethical, reliable recruitment — compliance and quality for long-term workforce success.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Vision</h3>
            <p className="mt-2 text-slate-600">
              A globally trusted OEP known for integrity, speed, and excellence across GCC, Europe, and international markets.
            </p>
          </div>
        </div>
      </section>

      <section id="employers" className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold tracking-tight">For employers</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Share your requirement — volume, trade, timeline, and destination. Submissions go straight to your staff dashboard
            for follow-up.
          </p>
          <EmployerInquiryForm />
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Contact</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase text-slate-500">Head office</p>
            <p className="mt-2 text-sm">Vehari Road, Mailsi, Multan, Pakistan</p>
            <p className="mt-2 text-sm font-medium">+92 067 3602501</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase text-slate-500">Islamabad</p>
            <p className="mt-2 text-sm">Fayyaz Plaza, G-6 Blue Area, Islamabad</p>
            <p className="mt-2 text-sm font-medium">+92 326 8362369</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase text-slate-500">Email</p>
            <p className="mt-2 text-sm font-medium">ramlahinternational@gmail.com</p>
          </div>
        </div>
      </section>
    </>
  );
}
