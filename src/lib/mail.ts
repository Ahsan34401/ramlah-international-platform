import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

async function getSmtpFrom(): Promise<string> {
  const row = await prisma.siteSetting.findUnique({ where: { key: "smtp_from" } });
  return row?.value?.trim() || process.env.SMTP_FROM || "noreply@ramlah.local";
}

export async function getTeamNotifyEmails(): Promise<string[]> {
  const row = await prisma.siteSetting.findUnique({ where: { key: "notify_email" } });
  const raw = (row?.value ?? process.env.NOTIFY_EMAIL ?? "").trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function sendMailSafe(options: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    console.info("[mail] SMTP_HOST not set — skipped:", options.subject);
    return { ok: false, skipped: true };
  }

  try {
    const port = Number(process.env.SMTP_PORT || "587");
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    const from = await getSmtpFrom();
    const to = Array.isArray(options.to) ? options.to.join(", ") : options.to;

    await transporter.sendMail({
      from,
      to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? `<pre style="font-family:system-ui">${escapeHtml(options.text)}</pre>`,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "send failed";
    console.error("[mail]", msg);
    return { ok: false, error: msg };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewApplication(payload: {
  referenceCode: string | null;
  fullName: string;
  email: string;
  phone: string;
  jobTitle?: string | null;
}): Promise<void> {
  const ref = payload.referenceCode ?? "(pending)";
  const base = (process.env.PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const trackLine = base
    ? `Track your application: ${base}/track-application`
    : `Track your application on our website under “Track application”.`;
  const applicantText = [
    `Thank you for applying with Ramlah International.`,
    ``,
    `Your application reference: ${ref}`,
    `Name: ${payload.fullName}`,
    `Job: ${payload.jobTitle ?? "General / open application"}`,
    ``,
    trackLine,
    `Use this reference with the email address you applied with.`,
  ].join("\n");

  await sendMailSafe({
    to: payload.email,
    subject: `Application received — ${ref}`,
    text: applicantText,
  });

  const team = await getTeamNotifyEmails();
  if (team.length) {
    await sendMailSafe({
      to: team,
      subject: `[Ramlah] New application ${ref}`,
      text: [
        `New job application received.`,
        `Reference: ${ref}`,
        `Name: ${payload.fullName}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Job: ${payload.jobTitle ?? "—"}`,
        ``,
        `Review in admin dashboard → Applications.`,
      ].join("\n"),
    });
  }
}

export async function notifyNewEmployerInquiry(payload: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country?: string | null;
  sector?: string | null;
  workersNeeded?: string | null;
  message?: string | null;
}): Promise<void> {
  const employerText = [
    `Thank you for contacting Ramlah International.`,
    ``,
    `We have received your talent request for ${payload.companyName}.`,
    `Our team will respond within 24 hours.`,
    ``,
    `— Ramlah International (Licensed OEP)`,
  ].join("\n");

  await sendMailSafe({
    to: payload.email,
    subject: "We received your inquiry — Ramlah International",
    text: employerText,
  });

  const team = await getTeamNotifyEmails();
  if (team.length) {
    await sendMailSafe({
      to: team,
      subject: `[Ramlah] New employer inquiry — ${payload.companyName}`,
      text: [
        `New employer inquiry.`,
        `Company: ${payload.companyName}`,
        `Contact: ${payload.contactName}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Country: ${payload.country ?? "—"}`,
        `Sector: ${payload.sector ?? "—"}`,
        `Workers: ${payload.workersNeeded ?? "—"}`,
        ``,
        `Message:`,
        payload.message ?? "—",
      ].join("\n"),
    });
  }
}

export async function notifyApplicationStatusChange(payload: {
  email: string;
  referenceCode: string | null;
  fullName: string;
  status: string;
}): Promise<void> {
  const ref = payload.referenceCode ?? "";
  const label = payload.status.replace(/_/g, " ");
  await sendMailSafe({
    to: payload.email,
    subject: `Application update — ${ref}`,
    text: [
      `Dear ${payload.fullName},`,
      ``,
      `Your application status has been updated to: ${label}.`,
      `Reference: ${ref || "—"}`,
      ``,
      `You can track progress on our website under “Track application”.`,
      ``,
      `— Ramlah International`,
    ].join("\n"),
  });
}
