"use client";

import { useState } from "react";
import { TRACK_PIPELINE } from "@/lib/constants";

type Ok = {
  referenceCode: string | null;
  applicant: string;
  jobTitle: string;
  status: string;
  rejected: boolean;
  stepIndex: number;
  steps: readonly { key: string; label: string }[];
  updatedAt: string;
  message: string;
};

export default function TrackApplicationPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Ok | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode: referenceCode.trim(), email: email.trim() }),
      });
      const json = (await res.json()) as { found?: boolean } & Partial<Ok>;
      if (res.status === 404 || !json.found) {
        setError(
          "No application found for this reference and email. Check your details or contact support.",
        );
        return;
      }
      if (!res.ok) {
        setError("Could not look up status. Try again.");
        return;
      }
      setData({
        referenceCode: json.referenceCode ?? null,
        applicant: json.applicant ?? "",
        jobTitle: json.jobTitle ?? "",
        status: json.status ?? "",
        rejected: Boolean(json.rejected),
        stepIndex: typeof json.stepIndex === "number" ? json.stepIndex : 0,
        steps: Array.isArray(json.steps) ? json.steps : TRACK_PIPELINE,
        updatedAt: json.updatedAt ?? "",
        message: json.message ?? "",
      });
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Track your application</h1>
      <p className="mt-2 text-slate-600">
        Enter the reference code shown after you applied (e.g. RI-2026-12345) and the email you used on the form.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs font-medium text-slate-600">Reference code</label>
          <input
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="RI-2026-12345"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono uppercase"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Checking…" : "Track status"}
        </button>
      </form>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>
      ) : null}

      {data ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">Reference</p>
          <p className="font-mono text-lg font-bold text-emerald-800">{data.referenceCode}</p>
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-900">{data.applicant}</span> · {data.jobTitle}
          </p>
          <p className="mt-2 text-sm">
            Status: <span className="font-semibold">{data.status.replace(/_/g, " ")}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Last updated: {data.updatedAt.slice(0, 10)}</p>

          {data.rejected ? (
            <p className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
              This application is marked as rejected. For more information, contact Ramlah with your reference code.
            </p>
          ) : (
            <ol className="mt-6 space-y-3">
              {data.steps.map((step, i) => {
                const active = i <= data.stepIndex;
                const current = i === data.stepIndex;
                return (
                  <li
                    key={step.key}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                      current
                        ? "border-emerald-300 bg-emerald-50 font-semibold text-emerald-900"
                        : active
                          ? "border-slate-200 bg-slate-50 text-slate-800"
                          : "border-slate-100 text-slate-400"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold">
                      {i + 1}
                    </span>
                    {step.label}
                  </li>
                );
              })}
            </ol>
          )}
          <p className="mt-6 text-sm text-slate-600">{data.message}</p>
        </div>
      ) : null}
    </div>
  );
}
