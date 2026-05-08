import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { TawkEmbed } from "@/components/tawk-embed";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getTawkIds } from "@/lib/integrations";
import { getPublicSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSiteSettings();
  const tawk = await getTawkIds();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader license={settings.licenseDisplay} />
      {children}
      <PublicFooter />
      <WhatsAppFloat
        whatsappE164={settings.whatsappE164}
        waMsgEmployer={settings.waMsgEmployer}
        waMsgJobseeker={settings.waMsgJobseeker}
      />
      {tawk ? <TawkEmbed propertyId={tawk.propertyId} widgetId={tawk.widgetId} /> : null}
    </div>
  );
}
