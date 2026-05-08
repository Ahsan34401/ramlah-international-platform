import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * SQLite URL resolution aligned with Prisma CLI: relative paths use the **prisma/** schema folder
 * as base (same as `schema.prisma` location). Absolute `file:` URLs pass through.
 *
 * Examples:
 * - `file:./prod.db` → `{cwd}/prisma/prod.db`
 * - `file:./prisma/prod.db` → `{cwd}/prisma/prod.db` (legacy Hostinger paste — normalized)
 */
export function resolveDatabaseUrl(): string {
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
    const rest = rawEnv.slice("file:".length).trim();
    const filepath = rest.startsWith("./") ? rest.slice(2) : rest;
    const prismaDir = path.join(process.cwd(), "prisma");

    if (path.isAbsolute(filepath)) {
      absolute = filepath;
    } else if (filepath.startsWith("prisma/")) {
      absolute = path.join(process.cwd(), filepath);
    } else {
      absolute = path.resolve(prismaDir, filepath);
    }
  }

  try {
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
  } catch {
    /* ignore */
  }

  return pathToFileURL(absolute).href;
}
