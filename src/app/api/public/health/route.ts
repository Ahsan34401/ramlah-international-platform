import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Quick deploy check: DB reachable & migrated (does not expose secrets).
 * GET https://your-domain.com/api/public/health
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    let hint: string | undefined;
    if (msg.includes("does not exist") || msg.includes("Unknown table")) {
      hint = "Run: npm run db:deploy (tables missing)";
    } else if (
      msg.includes("DATABASE_URL") ||
      msg.includes("DATABASE_URL is not set") ||
      msg.includes("Can't reach database") ||
      msg.includes("P1001") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND")
    ) {
      hint =
        "Check DATABASE_URL (Hostinger env + restart): mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME — password @ → %40; try 127.0.0.1 instead of localhost";
    } else if (
      msg.includes("P1000") ||
      msg.includes("Authentication failed") ||
      msg.includes("Access denied") ||
      msg.includes("ER_ACCESS_DENIED")
    ) {
      hint =
        "MySQL rejected credentials — fix USER/PASSWORD in DATABASE_URL and ensure that user is assigned to this database in hPanel";
    } else if (msg.includes("ER_BAD_DB_ERROR") || msg.includes("Unknown database")) {
      hint =
        "Database name in URL is wrong — last segment must match MySQL database name (e.g. u430579795_Ramlah)";
    }
    return NextResponse.json(
      { ok: false, db: false, hint: hint ?? null },
      { status: 503 },
    );
  }
}
