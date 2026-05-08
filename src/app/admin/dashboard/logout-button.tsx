"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/10 hover:text-white"
    >
      Sign out
    </button>
  );
}
