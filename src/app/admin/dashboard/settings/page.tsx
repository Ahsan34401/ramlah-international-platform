import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "@/app/admin/actions";

const KEYS = [
  { key: "whatsapp_e164", label: "WhatsApp (digits only, country code)", placeholder: "923268362369" },
  { key: "phone_display", label: "Phone (display)", placeholder: "+92 326 8362369" },
  { key: "license_display", label: "License line", placeholder: "OPE.HRD3789/MTN2015" },
  { key: "wa_msg_employer", label: "WhatsApp prefilled message — employers", placeholder: "Hello…" },
  { key: "wa_msg_jobseeker", label: "WhatsApp prefilled message — job seekers", placeholder: "Hello…" },
] as const;

const INTEGRATION_KEYS = [
  {
    key: "notify_email",
    label: "Team inbox (application & inquiry alerts)",
    placeholder: "ops@yourdomain.com",
    rows: 1 as const,
  },
  {
    key: "smtp_from",
    label: "SMTP From header (optional)",
    placeholder: 'Ramlah International <noreply@yourdomain.com>',
    rows: 1 as const,
  },
  {
    key: "tawk_property_id",
    label: "Tawk.to property ID",
    placeholder: "From embed code: embed.tawk.to/PROPERTY_ID/WIDGET_ID",
    rows: 1 as const,
  },
  {
    key: "tawk_widget_id",
    label: "Tawk.to widget ID",
    placeholder: "Second segment of the embed URL",
    rows: 1 as const,
  },
] as const;

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Site settings</h1>
      <p className="mt-1 text-slate-600">Used on the public site header, footer, and WhatsApp floating buttons.</p>
      <form action={updateSiteSettings} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {KEYS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-medium text-slate-600">{label}</label>
            <textarea
              name={key}
              rows={key.includes("msg") ? 3 : 1}
              defaultValue={map.get(key) ?? ""}
              placeholder={placeholder}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900">Email &amp; chat</h2>
          <p className="mt-2 text-xs text-slate-600">
            Transactional email uses environment variables:{" "}
            <code className="rounded bg-slate-100 px-1">SMTP_HOST</code>, <code className="rounded bg-slate-100 px-1">SMTP_PORT</code>,{" "}
            <code className="rounded bg-slate-100 px-1">SMTP_USER</code>, <code className="rounded bg-slate-100 px-1">SMTP_PASS</code>, optional{" "}
            <code className="rounded bg-slate-100 px-1">SMTP_SECURE</code>, <code className="rounded bg-slate-100 px-1">SMTP_FROM</code>. Set{" "}
            <code className="rounded bg-slate-100 px-1">PUBLIC_SITE_URL</code> for correct links in applicant emails. Fallback team address:{" "}
            <code className="rounded bg-slate-100 px-1">NOTIFY_EMAIL</code> or the field below.
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Tawk.to: paste both IDs from your widget snippet. When both are set, the chat bubble loads on every public page.
          </p>
        </div>

        {INTEGRATION_KEYS.map(({ key, label, placeholder, rows }) => (
          <div key={key}>
            <label className="text-xs font-medium text-slate-600">{label}</label>
            <textarea
              name={key}
              rows={rows}
              defaultValue={map.get(key) ?? ""}
              placeholder={placeholder}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
