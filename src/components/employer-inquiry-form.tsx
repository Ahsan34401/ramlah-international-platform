"use client";

import { useState } from "react";

export function EmployerInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      companyName: String(fd.get("companyName") ?? ""),
      contactName: String(fd.get("contactName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? "") || null,
      workersNeeded: String(fd.get("workersNeeded") ?? "") || null,
      sector: String(fd.get("sector") ?? "") || null,
      message: String(fd.get("message") ?? "") || null,
    };
    try {
      const res = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setStatus("err");
        setMsg("Could not send — check fields and try again.");
        return;
      }
      setStatus("ok");
      setMsg("Thank you. Your inquiry has been received — our team will contact you within 24 hours.");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-slate-600">Company name</label>
        <input name="companyName" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Contact name</label>
        <input name="contactName" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Work email</label>
        <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Phone / WhatsApp</label>
        <input name="phone" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Country</label>
        <input name="country" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Workers needed (approx.)</label>
        <input name="workersNeeded" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-slate-600">Sector / trade</label>
        <input name="sector" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-slate-600">Project details</label>
        <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      {msg ? (
        <p className={`sm:col-span-2 text-sm ${status === "ok" ? "text-emerald-700" : "text-red-600"}`}>{msg}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Request talent"}
        </button>
      </div>
    </form>
  );
}
