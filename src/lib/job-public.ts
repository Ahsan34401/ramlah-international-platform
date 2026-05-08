import type { Prisma } from "@prisma/client";

/** Jobs visible on the public site */
export function publishedJobWhere(): Prisma.JobWhereInput {
  const now = new Date();
  return {
    status: "PUBLISHED",
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}

export const publicJobOrderBy: Prisma.JobOrderByWithRelationInput[] = [
  { featured: "desc" },
  { publishedAt: "desc" },
];
