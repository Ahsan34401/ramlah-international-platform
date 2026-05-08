"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { notifyApplicationStatusChange } from "@/lib/mail";

async function requireAdmin() {
  const s = await getAdminSession();
  if (!s) {
    throw new Error("Unauthorized");
  }
}

export async function updateApplicationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) {
    return;
  }
  const prev = await prisma.jobApplication.findUnique({ where: { id } });
  await prisma.jobApplication.update({
    where: { id },
    data: { status },
  });
  if (prev && prev.status !== status && process.env.SMTP_HOST) {
    void notifyApplicationStatusChange({
      email: prev.email,
      referenceCode: prev.referenceCode,
      fullName: prev.fullName,
      status,
    }).catch(() => {});
  }
  revalidatePath("/admin/dashboard/applications");
  revalidatePath(`/admin/dashboard/applications/${id}`);
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) {
    return;
  }
  await prisma.employerInquiry.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/dashboard/inquiries");
}

export async function updateInquiryNote(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const internalNote = String(formData.get("internalNote") ?? "").trim() || null;
  if (!id) {
    return;
  }
  await prisma.employerInquiry.update({
    where: { id },
    data: { internalNote },
  });
  revalidatePath("/admin/dashboard/inquiries");
}

export async function createJob(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const sector = String(formData.get("sector") ?? "").trim() || null;
  const salaryHint = String(formData.get("salaryHint") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT");
  const featured = ["on", "true"].includes(String(formData.get("featured") ?? ""));
  const exp = String(formData.get("expiresAt") ?? "").trim();
  let expiresAt: Date | null = null;
  if (exp) {
    const d = new Date(exp);
    if (!Number.isNaN(d.getTime())) {
      expiresAt = d;
    }
  }
  if (!title || !slug) {
    return;
  }
  const publishedAt = status === "PUBLISHED" ? new Date() : null;
  await prisma.job.create({
    data: {
      title,
      slug,
      summary,
      description,
      country,
      sector,
      salaryHint,
      status,
      featured,
      expiresAt,
      publishedAt,
    },
  });
  revalidatePath("/admin/dashboard/jobs");
  revalidatePath("/jobs");
}

export async function updateJob(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const sector = String(formData.get("sector") ?? "").trim() || null;
  const salaryHint = String(formData.get("salaryHint") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT");
  const featured = ["on", "true"].includes(String(formData.get("featured") ?? ""));
  const exp = String(formData.get("expiresAt") ?? "").trim();
  let expiresAt: Date | null = null;
  if (exp) {
    const d = new Date(exp);
    if (!Number.isNaN(d.getTime())) {
      expiresAt = d;
    }
  }
  if (!title || !slug) {
    return;
  }
  const job = await prisma.job.findUnique({ where: { id } });
  let publishedAt = job?.publishedAt ?? null;
  if (status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }
  if (status !== "PUBLISHED") {
    publishedAt = job?.publishedAt ?? null;
  }
  await prisma.job.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      description,
      country,
      sector,
      salaryHint,
      status,
      featured,
      expiresAt,
      publishedAt,
    },
  });
  revalidatePath("/admin/dashboard/jobs");
  revalidatePath("/jobs");
}

export async function deleteJob(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/dashboard/jobs");
  revalidatePath("/jobs");
}

export async function duplicateJob(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) {
    return;
  }
  const slug = `${job.slug.replace(/-copy-\d+$/, "")}-copy-${Date.now()}`;
  await prisma.job.create({
    data: {
      title: `${job.title} (copy)`,
      slug,
      summary: job.summary,
      description: job.description,
      country: job.country,
      sector: job.sector,
      salaryHint: job.salaryHint,
      status: "DRAFT",
      featured: false,
      expiresAt: null,
      publishedAt: null,
    },
  });
  revalidatePath("/admin/dashboard/jobs");
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const keys = [
    "whatsapp_e164",
    "phone_display",
    "license_display",
    "wa_msg_employer",
    "wa_msg_jobseeker",
    "notify_email",
    "smtp_from",
    "tawk_property_id",
    "tawk_widget_id",
  ] as const;
  for (const key of keys) {
    const value = String(formData.get(key) ?? "").trim();
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
  revalidatePath("/admin/dashboard/settings");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT");
  if (!title || !slug || !content.trim()) {
    return;
  }
  const publishedAt = status === "PUBLISHED" ? new Date() : null;
  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
    },
  });
  revalidatePath("/admin/dashboard/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT");
  if (!title || !slug || !content.trim()) {
    return;
  }
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const oldSlug = existing?.slug;
  let publishedAt = existing?.publishedAt ?? null;
  if (status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }
  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
    },
  });
  revalidatePath("/admin/dashboard/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/blog/${oldSlug}`);
  }
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
  if (!post) {
    return;
  }
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/dashboard/blog");
  revalidatePath("/blog");
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`);
  }
}

export async function createCountry(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const blurb = String(formData.get("blurb") ?? "").trim() || null;
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const sortOrder = Math.floor(Number(formData.get("sortOrder") || "0"));
  const active = formData.has("active");
  if (!name || !slug || !code || Number.isNaN(lat) || Number.isNaN(lng)) {
    return;
  }
  await prisma.country.create({
    data: { name, slug, code, blurb, lat, lng, sortOrder, active },
  });
  revalidatePath("/admin/dashboard/countries");
  revalidatePath("/countries");
}

export async function updateCountry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const blurb = String(formData.get("blurb") ?? "").trim() || null;
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const sortOrder = Math.floor(Number(formData.get("sortOrder") || "0"));
  const active = formData.has("active");
  if (!name || !slug || !code || Number.isNaN(lat) || Number.isNaN(lng)) {
    return;
  }
  await prisma.country.update({
    where: { id },
    data: { name, slug, code, blurb, lat, lng, sortOrder, active },
  });
  revalidatePath("/admin/dashboard/countries");
  revalidatePath("/countries");
  revalidatePath(`/countries/${slug}`);
}

export async function deleteCountry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const row = await prisma.country.findUnique({ where: { id }, select: { slug: true } });
  if (!row) {
    return;
  }
  await prisma.country.delete({ where: { id } });
  revalidatePath("/admin/dashboard/countries");
  revalidatePath("/countries");
  revalidatePath(`/countries/${row.slug}`);
}
