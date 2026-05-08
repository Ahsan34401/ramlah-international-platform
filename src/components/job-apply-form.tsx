"use client";

import { useState } from "react";

type Props = {
  jobId: string | null;
  defaultCategory?: string;
};

export function JobApplyForm({ jobId, defaultCategory }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    setRef(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (jobId) {
      fd.set("jobId", jobId);
    } else {
      fd.delete("jobId");
    }
    try {
      const res = await fetch("/api/public/applications", {
        method: "POST",
        body: fd,
      });
      const j = (await res.json()) as { ok?: boolean; referenceCode?: string; error?: unknown };
      if (!res.ok) {
        setStatus("err");
        setMsg("Submit failed — check required fields and file types (PDF/DOC CV, JPG/PNG photo).");
        return;
      }
      setStatus("ok");
      setRef(j.referenceCode ?? null);
      setMsg(
        "Application received. Save your reference code to track status. Our recruitment team will review your profile.",
      );
      form.reset();
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-600">Full name</label>
        <input name="fullName" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Phone / WhatsApp</label>
          <input name="phone" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-600">CNIC (optional)</label>
          <input name="cnic" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Trade / category</label>
          <input
            name="category"
            defaultValue={defaultCategory ?? ""}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-600">Years of experience</label>
          <input
            name="experienceYears"
            type="number"
            min={0}
            max={80}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Expected salary (brief)</label>
          <input name="expectedSalary" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Available from</label>
        <input name="availableFrom" type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Skills (comma or short list)</label>
        <textarea name="skills" rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Experience / notes</label>
        <textarea name="message" rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Cover letter (optional)</label>
        <textarea name="coverLetter" rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">CV (PDF or DOC, max 5MB)</label>
        <input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf" className="mt-1 w-full text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Photo (optional, max 2MB)</label>
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 w-full text-sm" />
      </div>
      {ref ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase text-emerald-800">Your reference code</p>
          <p className="font-mono text-xl font-bold text-emerald-900">{ref}</p>
          <p className="mt-2 text-sm text-emerald-900">
            Use it on the <a href="/track-application" className="underline">Track application</a> page with your email.
          </p>
        </div>
      ) : null}
      {msg ? (
        <p className={`text-sm ${status === "ok" ? "text-emerald-700" : "text-red-600"}`}>{msg}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
