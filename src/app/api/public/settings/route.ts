import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const s = await getPublicSiteSettings();
  return NextResponse.json({
    whatsappE164: s.whatsappE164,
    phoneDisplay: s.phoneDisplay,
    licenseDisplay: s.licenseDisplay,
    waMsgEmployer: s.waMsgEmployer,
    waMsgJobseeker: s.waMsgJobseeker,
  });
}
