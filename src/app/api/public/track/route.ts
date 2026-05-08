import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackRequestSchema } from "@/lib/validators";
import { trackStepIndex, TRACK_PIPELINE } from "@/lib/constants";

function partialName(full: string): string {
  const p = full.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) {
    return "—";
  }
  if (p.length === 1) {
    return p[0].length > 2 ? `${p[0].slice(0, 2)}…` : p[0];
  }
  const last = p[p.length - 1];
  return `${p[0]} ${last[0]}.`;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = trackRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { referenceCode, email } = parsed.data;

  const app = await prisma.jobApplication.findFirst({
    where: { referenceCode },
    include: { job: { select: { title: true, slug: true } } },
  });

  if (!app || app.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  const step = trackStepIndex(app.status);
  const rejected = app.status === "REJECTED";

  return NextResponse.json({
    found: true,
    referenceCode: app.referenceCode,
    applicant: partialName(app.fullName),
    jobTitle: app.job?.title ?? "General application",
    status: app.status,
    rejected,
    stepIndex: rejected ? -1 : step,
    steps: TRACK_PIPELINE,
    updatedAt: app.updatedAt.toISOString(),
    message:
      "Our HR team updates this status as your file progresses. If there is no change for more than 14 days, contact us with your reference code.",
  });
}
