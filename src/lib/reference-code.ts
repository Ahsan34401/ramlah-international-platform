import { prisma } from "@/lib/prisma";

export async function generateUniqueReferenceCode(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 25; attempt++) {
    const n = Math.floor(10000 + Math.random() * 90000);
    const code = `RI-${year}-${n}`;
    const exists = await prisma.jobApplication.findFirst({
      where: { referenceCode: code },
      select: { id: true },
    });
    if (!exists) {
      return code;
    }
  }
  throw new Error("Could not generate unique reference code");
}
