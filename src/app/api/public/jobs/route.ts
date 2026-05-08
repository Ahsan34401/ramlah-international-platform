import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicJobOrderBy, publishedJobWhere } from "@/lib/job-public";

export async function GET() {
  const jobs = await prisma.job.findMany({
    where: publishedJobWhere(),
    orderBy: publicJobOrderBy,
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      country: true,
      sector: true,
      salaryHint: true,
      featured: true,
      publishedAt: true,
      expiresAt: true,
    },
  });
  return NextResponse.json({ jobs });
}
