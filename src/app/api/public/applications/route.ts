import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { applicationCreateSchema } from "@/lib/validators";
import { generateUniqueReferenceCode } from "@/lib/reference-code";
import { notifyNewApplication } from "@/lib/mail";

const UPLOAD = path.join(process.cwd(), "uploads");
const MAX_CV = 5 * 1024 * 1024;
const MAX_PHOTO = 2 * 1024 * 1024;

function allowedCv(name: string): boolean {
  const n = name.toLowerCase();
  return n.endsWith(".pdf") || n.endsWith(".doc") || n.endsWith(".docx");
}

function allowedPhoto(name: string): boolean {
  const n = name.toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".webp");
}

async function saveFile(relDir: string, file: File, max: number, name: string): Promise<string> {
  if (file.size > max) {
    throw new Error(`${name} exceeds size limit`);
  }
  const orig = file.name || "file";
  const ext = path.extname(orig) || (name === "cv" ? ".pdf" : ".jpg");
  const safe = `${name}${ext}`;
  const rel = path.posix.join(relDir.replace(/\\/g, "/"), safe);
  const full = path.join(UPLOAD, rel);
  await mkdir(path.dirname(full), { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(full, buf);
  return rel;
}

async function fireApplicationEmails(row: {
  id: string;
  referenceCode: string | null;
  fullName: string;
  email: string;
  phone: string;
  jobId: string | null;
}) {
  const job = row.jobId
    ? await prisma.job.findUnique({ where: { id: row.jobId }, select: { title: true } })
    : null;
  void notifyNewApplication({
    referenceCode: row.referenceCode,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    jobTitle: job?.title ?? null,
  }).catch(() => {});
}

async function assertJobOpen(jobId: string | null) {
  if (!jobId) {
    return;
  }
  const now = new Date();
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      status: "PUBLISHED",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
  });
  if (!job) {
    throw new Error("Job not available");
  }
}

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  try {
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const jobIdRaw = form.get("jobId");
      const jobId =
        typeof jobIdRaw === "string" && jobIdRaw.length > 0 ? jobIdRaw : null;

      const fullName = String(form.get("fullName") ?? "");
      const email = String(form.get("email") ?? "");
      const phone = String(form.get("phone") ?? "");
      const cnic = String(form.get("cnic") ?? "") || null;
      const category = String(form.get("category") ?? "") || null;
      const message = String(form.get("message") ?? "") || null;
      const skills = String(form.get("skills") ?? "") || null;
      const coverLetter = String(form.get("coverLetter") ?? "") || null;
      const expectedSalary = String(form.get("expectedSalary") ?? "") || null;
      const expRaw = String(form.get("experienceYears") ?? "");
      const availRaw = String(form.get("availableFrom") ?? "");

      const parsed = applicationCreateSchema.safeParse({
        jobId: jobId ?? undefined,
        fullName,
        email,
        phone,
        cnic,
        category,
        message,
        skills,
        coverLetter,
        expectedSalary,
        experienceYears: expRaw === "" ? undefined : expRaw,
        availableFrom: availRaw === "" ? undefined : availRaw,
      });
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }

      await assertJobOpen(parsed.data.jobId ?? null);

      const referenceCode = await generateUniqueReferenceCode();

      const row = await prisma.jobApplication.create({
        data: {
          referenceCode,
          jobId: parsed.data.jobId ?? null,
          fullName: parsed.data.fullName,
          email: parsed.data.email.toLowerCase(),
          phone: parsed.data.phone,
          cnic: parsed.data.cnic ?? null,
          category: parsed.data.category ?? null,
          message: parsed.data.message ?? null,
          skills: parsed.data.skills ?? null,
          coverLetter: parsed.data.coverLetter ?? null,
          expectedSalary: parsed.data.expectedSalary ?? null,
          experienceYears: parsed.data.experienceYears ?? null,
          availableFrom: parsed.data.availableFrom ?? null,
          status: "RECEIVED",
        },
      });

      const relBase = `applications/${row.id}`;
      let cvPath: string | null = null;
      let photoPath: string | null = null;

      const cv = form.get("cv");
      if (cv instanceof File && cv.size > 0) {
        if (!allowedCv(cv.name)) {
          return NextResponse.json({ error: "CV must be PDF or DOC/DOCX" }, { status: 400 });
        }
        cvPath = await saveFile(relBase, cv, MAX_CV, "cv");
      }
      const photo = form.get("photo");
      if (photo instanceof File && photo.size > 0) {
        if (!allowedPhoto(photo.name)) {
          return NextResponse.json({ error: "Photo must be JPG or PNG" }, { status: 400 });
        }
        photoPath = await saveFile(relBase, photo, MAX_PHOTO, "photo");
      }

      if (cvPath || photoPath) {
        await prisma.jobApplication.update({
          where: { id: row.id },
          data: { cvPath: cvPath ?? undefined, photoPath: photoPath ?? undefined },
        });
      }

      await fireApplicationEmails({
        id: row.id,
        referenceCode: row.referenceCode,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        jobId: row.jobId,
      });

      return NextResponse.json({
        ok: true,
        id: row.id,
        referenceCode: row.referenceCode,
      });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = applicationCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    await assertJobOpen(data.jobId ?? null);

    const referenceCode = await generateUniqueReferenceCode();
    const row = await prisma.jobApplication.create({
      data: {
        referenceCode,
        jobId: data.jobId ?? null,
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        cnic: data.cnic ?? null,
        category: data.category ?? null,
        message: data.message ?? null,
        skills: data.skills ?? null,
        coverLetter: data.coverLetter ?? null,
        expectedSalary: data.expectedSalary ?? null,
        experienceYears: data.experienceYears ?? null,
        availableFrom: data.availableFrom ?? null,
        status: "RECEIVED",
      },
    });
    await fireApplicationEmails({
      id: row.id,
      referenceCode: row.referenceCode,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      jobId: row.jobId,
    });
    return NextResponse.json({
      ok: true,
      id: row.id,
      referenceCode: row.referenceCode,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    if (msg === "Job not available") {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
