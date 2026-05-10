import { redirect } from "next/navigation";
import { AdminDashboardShell } from "@/components/admin-dashboard-shell";
import { getAdminSession } from "@/lib/auth";

/** Avoid Prisma during static generation / CI builds (no DB file yet). */
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboardShell email={session.email}>{children}</AdminDashboardShell>;
}
