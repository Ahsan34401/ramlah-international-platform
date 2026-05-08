import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  const url = new URL(req.url);
  const t = url.searchParams.get("t") === "photo" ? "photo" : "cv";

  const app = await prisma.jobApplication.findUnique({ where: { id } });
  if (!app) {
    return new Response("Not found", { status: 404 });
  }
  const rel = t === "photo" ? app.photoPath : app.cvPath;
  if (!rel || rel.includes("..")) {
    return new Response("No file", { status: 404 });
  }
  const full = path.join(process.cwd(), "uploads", rel);
  if (!existsSync(full)) {
    return new Response("Missing file", { status: 404 });
  }
  const buf = await readFile(full);
  const ext = path.extname(full).toLowerCase();
  const ct =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".doc"
            ? "application/msword"
            : ext === ".docx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/pdf";

  return new Response(buf, {
    headers: {
      "Content-Type": ct,
      "Content-Disposition": `attachment; filename="${t}${ext}"`,
    },
  });
}
