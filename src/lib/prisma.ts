import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma(): PrismaClient {
  const url = resolveDatabaseUrl();
  return new PrismaClient({
    datasources: {
      db: { url },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

/** Reuse one client per Node process (build + Hostinger); avoids extra pools in prod. */
globalForPrisma.prisma = prisma;
