import type { Prisma } from "@prisma/client";

export function publishedBlogWhere(): Prisma.BlogPostWhereInput {
  return {
    status: "PUBLISHED",
    publishedAt: { not: null },
  };
}
