import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { resolveDatabaseUrl } from "../src/lib/database-url";

const prisma = new PrismaClient({
  datasources: {
    db: { url: resolveDatabaseUrl() },
  },
});

function genRef(year: number): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `RI-${year}-${n}`;
}

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL ?? "admin@ramlah.local").toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_SEED_NAME ?? "Ramlah Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name,
      role: "ADMIN",
    },
    update: {
      passwordHash,
      name,
      role: "ADMIN",
    },
  });

  const siteDefaults: [string, string][] = [
    ["whatsapp_e164", "923268362369"],
    ["phone_display", "+92 326 8362369"],
    ["license_display", "OPE.HRD3789/MTN2015"],
    [
      "wa_msg_employer",
      "Hello! I found Ramlah International online and I would like to hire workers.",
    ],
    [
      "wa_msg_jobseeker",
      "Hello! I found Ramlah International online and I would like to apply for overseas jobs.",
    ],
  ];
  for (const [key, value] of siteDefaults) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const sample = await prisma.job.count();
  if (sample === 0) {
    await prisma.job.createMany({
      data: [
        {
          title: "Industrial Electrician — Saudi Arabia",
          slug: "industrial-electrician-saudi-arabia",
          summary:
            "5+ years industrial experience, valid credentials, deployment within agreed timeline.",
          country: "Saudi Arabia",
          sector: "Construction / MEP",
          salaryHint: "As per Saudi market + benefits",
          status: "PUBLISHED",
          featured: true,
          publishedAt: new Date(),
        },
        {
          title: "Hospitality Supervisor — UAE",
          slug: "hospitality-supervisor-uae",
          summary: "Hotel operations background, English communication, prior GCC preferred.",
          country: "United Arab Emirates",
          sector: "Hospitality",
          salaryHint: "Competitive package",
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      ],
    });
  }

  await prisma.jobApplication.updateMany({
    where: { status: "NEW" },
    data: { status: "RECEIVED" },
  });

  const year = new Date().getFullYear();
  const missingRef = await prisma.jobApplication.findMany({
    where: { referenceCode: null },
    select: { id: true },
  });
  for (const row of missingRef) {
    let code = genRef(year);
    for (let i = 0; i < 20; i++) {
      const clash = await prisma.jobApplication.findFirst({ where: { referenceCode: code } });
      if (!clash) break;
      code = genRef(year);
    }
    await prisma.jobApplication.update({
      where: { id: row.id },
      data: { referenceCode: code },
    });
  }

  const optionalSettings: [string, string][] = [
    ["notify_email", ""],
    ["smtp_from", ""],
    ["tawk_property_id", ""],
    ["tawk_widget_id", ""],
  ];
  for (const [key, value] of optionalSettings) {
    const ex = await prisma.siteSetting.findUnique({ where: { key } });
    if (!ex) {
      await prisma.siteSetting.create({ data: { key, value } });
    }
  }

  if ((await prisma.country.count()) === 0) {
    await prisma.country.createMany({
      data: [
        { name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", lat: 23.8859, lng: 45.0792, sortOrder: 1, blurb: "Major demand for construction, hospitality, and technical trades.", active: true },
        { name: "United Arab Emirates", slug: "uae", code: "AE", lat: 23.4241, lng: 53.8478, sortOrder: 2, blurb: "Dubai & Abu Dhabi — diverse sectors and competitive packages.", active: true },
        { name: "Kuwait", slug: "kuwait", code: "KW", lat: 29.3117, lng: 47.4818, sortOrder: 3, blurb: "Oil & gas support, construction, and services.", active: true },
        { name: "Qatar", slug: "qatar", code: "QA", lat: 25.3548, lng: 51.1839, sortOrder: 4, blurb: "Infrastructure and FIFA-legacy projects drive hiring.", active: true },
        { name: "Oman", slug: "oman", code: "OM", lat: 21.4735, lng: 55.9754, sortOrder: 5, blurb: "Logistics, tourism, and energy-related roles.", active: true },
        { name: "Bahrain", slug: "bahrain", code: "BH", lat: 26.0667, lng: 50.5577, sortOrder: 6, blurb: "Finance, hospitality, and industrial support.", active: true },
        { name: "Germany", slug: "germany", code: "DE", lat: 51.1657, lng: 10.4515, sortOrder: 10, blurb: "Skilled migration pathways — verify language and recognition rules.", active: true },
      ],
    });
  }

  if ((await prisma.blogPost.count()) === 0) {
    await prisma.blogPost.create({
      data: {
        title: "How to verify a legitimate overseas job offer",
        slug: "verify-legitimate-overseas-job-offer",
        excerpt: "Protect yourself from fraud: check license, employer, and contract basics before you pay anyone.",
        content:
          "## Government-licensed routes\n\nAlways confirm your recruiter is a registered **Overseas Employment Promoter** with valid license numbers.\n\n## Red flags\n\n- Guarantees without a proper offer letter\n- Upfront fees to \"secure\" a visa without a clear receipt\n- Pressure to pay in cash to personal accounts\n\n## Next steps\n\nAsk for employer name, project, and embassy verification where applicable. Ramlah operates with full documentation and transparent milestones.",
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: "Verify overseas job offers | Ramlah International",
        metaDescription: "Learn how to spot fraudulent overseas job offers and work only with licensed promoters.",
      },
    });
  }

  console.log("Seed OK — admin:", email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
