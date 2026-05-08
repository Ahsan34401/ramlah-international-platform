import { z } from "zod";

export const applicationCreateSchema = z.object({
  jobId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().cuid().optional(),
  ),
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(40),
  cnic: z.string().max(20).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  experienceYears: z.preprocess((v) => {
    if (v === null || v === undefined || v === "") {
      return null;
    }
    const n = Number(v);
    if (Number.isNaN(n)) {
      return null;
    }
    return Math.min(80, Math.max(0, Math.floor(n)));
  }, z.number().int().nullable().optional()),
  expectedSalary: z.string().max(120).optional().nullable(),
  availableFrom: z.preprocess((v) => {
    if (v === null || v === undefined || v === "") {
      return null;
    }
    const d = new Date(v as string | number | Date);
    return Number.isNaN(d.getTime()) ? null : d;
  }, z.date().nullable().optional()),
  skills: z.string().max(2000).optional().nullable(),
  coverLetter: z.string().max(8000).optional().nullable(),
});

export const inquiryCreateSchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(40),
  country: z.string().max(120).optional().nullable(),
  workersNeeded: z.string().max(120).optional().nullable(),
  sector: z.string().max(120).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
});

export const trackRequestSchema = z.object({
  referenceCode: z.string().min(6).max(40).transform((s) => s.trim().toUpperCase()),
  email: z.string().email(),
});
