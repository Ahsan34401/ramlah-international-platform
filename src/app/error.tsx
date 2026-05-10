"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Production hides full Server Component errors in the browser (by design).
 * This boundary shows the digest + links so deploy issues can be narrowed down.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-16 text-center text-slate-800">
      <p className="text-xs font-bold uppercase tracking-widest text-red-600">Something went wrong</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Page could not be loaded</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Next.js deliberately hides server error details in production. Your Hostinger / database logs will have the
        real reason (often <code className="rounded bg-slate-100 px-1 text-xs">DATABASE_URL</code> or missing{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">prisma migrate deploy</code>).
      </p>
      {error.digest ? (
        <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
          Digest: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Try again
        </button>
        <Link href="/" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Home
        </Link>
        <Link
          href="/api/public/health"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          DB health check
        </Link>
      </div>
    </div>
  );
}
