"use client";

import { useRouter } from "next/navigation";

type Props = {
  /** Override layout (e.g. compact header pill vs full-width sidebar). */
  className?: string;
};

export function AdminLogoutButton({ className }: Props) {
  const router = useRouter();
  const base =
    "rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50";
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className={className ?? `${base} w-full`}
    >
      Sign out
    </button>
  );
}
