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

  const rows = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: { select: { title: true } } },
    take: 5000,
  });

  const header = [
    "referenceCode",
    "createdAt",
    "status",
    "fullName",
    "email",
    "phone",
    "jobTitle",
    "category",
    "experienceYears",
    "expectedSalary",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.referenceCode ?? ""),
        csvEscape(r.createdAt.toISOString()),
        csvEscape(r.status),
        csvEscape(r.fullName),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(r.job?.title ?? ""),
        csvEscape(r.category ?? ""),
        csvEscape(String(r.experienceYears ?? "")),
        csvEscape(r.expectedSalary ?? ""),
      ].join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="applications.csv"',
    },
  });
}
