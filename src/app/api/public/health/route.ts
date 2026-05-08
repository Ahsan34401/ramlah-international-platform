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
    const hint =
      msg.includes("does not exist") || msg.includes("Unknown table")
        ? "Run: npx prisma migrate deploy"
        : msg.includes("DATABASE_URL") || msg.includes("Can't reach database")
          ? "Check DATABASE_URL (Hostinger → Env): mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME — encode @ in password as %40"
          : undefined;
    return NextResponse.json(
      { ok: false, db: false, hint },
      { status: 503 },
    );
  }
}
