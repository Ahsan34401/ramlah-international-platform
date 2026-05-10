import { prisma } from "@/lib/prisma";

export async function getTawkIds(): Promise<{ propertyId: string; widgetId: string } | null> {
  try {
    const [a, b] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "tawk_property_id" } }),
      prisma.siteSetting.findUnique({ where: { key: "tawk_widget_id" } }),
    ]);
    const propertyId = a?.value?.trim() ?? "";
    const widgetId = b?.value?.trim() ?? "";
    if (!propertyId || !widgetId) {
      return null;
    }
    return { propertyId, widgetId };
  } catch (e) {
    console.error("[getTawkIds] skipped — DB unavailable.", e);
    return null;
  }
}
