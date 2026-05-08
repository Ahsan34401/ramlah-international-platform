import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  whatsapp_e164: "923268362369",
  phone_display: "+92 326 8362369",
  license_display: "OPE.HRD3789/MTN2015",
  wa_msg_employer: "Hello! I found Ramlah International online and I would like to hire workers.",
  wa_msg_jobseeker: "Hello! I found Ramlah International online and I would like to apply for overseas jobs.",
};

export type PublicSiteSettings = {
  whatsappE164: string;
  phoneDisplay: string;
  licenseDisplay: string;
  waMsgEmployer: string;
  waMsgJobseeker: string;
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const get = (k: keyof typeof DEFAULTS) => map.get(k) ?? DEFAULTS[k];
  return {
    whatsappE164: get("whatsapp_e164"),
    phoneDisplay: get("phone_display"),
    licenseDisplay: get("license_display"),
    waMsgEmployer: get("wa_msg_employer"),
    waMsgJobseeker: get("wa_msg_jobseeker"),
  };
}
