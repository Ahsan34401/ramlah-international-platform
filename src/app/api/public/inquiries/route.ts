import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquiryCreateSchema } from "@/lib/validators";
import { notifyNewEmployerInquiry } from "@/lib/mail";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = inquiryCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const row = await prisma.employerInquiry.create({
    data: {
      companyName: d.companyName,
      contactName: d.contactName,
      email: d.email.toLowerCase(),
      phone: d.phone,
      country: d.country ?? null,
      workersNeeded: d.workersNeeded ?? null,
      sector: d.sector ?? null,
      message: d.message ?? null,
    },
  });
  void notifyNewEmployerInquiry({
    companyName: d.companyName,
    contactName: d.contactName,
    email: d.email.toLowerCase(),
    phone: d.phone,
    country: d.country,
    sector: d.sector,
    workersNeeded: d.workersNeeded,
    message: d.message,
  }).catch(() => {});
  return NextResponse.json({ id: row.id, ok: true });
}
