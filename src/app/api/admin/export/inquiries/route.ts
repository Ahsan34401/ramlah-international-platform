import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await prisma.employerInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const header = [
    "createdAt",
    "status",
    "companyName",
    "contactName",
    "email",
    "phone",
    "country",
    "sector",
    "workersNeeded",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.createdAt.toISOString()),
        csvEscape(r.status),
        csvEscape(r.companyName),
        csvEscape(r.contactName),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(r.country ?? ""),
        csvEscape(r.sector ?? ""),
        csvEscape(r.workersNeeded ?? ""),
      ].join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="employer-inquiries.csv"',
    },
  });
}
