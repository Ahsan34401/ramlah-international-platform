import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * SQLite relative paths (file:./...) resolve against process.cwd().
 * Ensures parent directory exists before Prisma opens the file (Hostinger-friendly).
 */
function resolveDatabaseUrl(): string {
  const rawEnv = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "") ?? "";
  if (!rawEnv) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!rawEnv.startsWith("file:")) {
    return rawEnv;
  }

  let absolute: string;
  try {
    absolute = fileURLToPath(rawEnv);
  } catch {
    let rest = rawEnv.slice("file:".length).trim();
    const filepath = rest.startsWith("./") ? rest.slice(2) : rest;
    absolute = path.isAbsolute(filepath)
      ? filepath
      : path.resolve(process.cwd(), filepath);
  }

  try {
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
  } catch {
    /* readonly FS — Prisma will report failure */
  }

  return pathToFileURL(absolute).href;
}

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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
