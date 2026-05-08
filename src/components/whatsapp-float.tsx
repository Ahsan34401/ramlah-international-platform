"use client";

type Props = {
  whatsappE164: string;
  waMsgEmployer: string;
  waMsgJobseeker: string;
};

export function WhatsAppFloat({ whatsappE164, waMsgEmployer, waMsgJobseeker }: Props) {
  const enc = (s: string) => encodeURIComponent(s);
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <a
        href={`https://wa.me/${whatsappE164}?text=${enc(waMsgEmployer)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#25D366] px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg ring-2 ring-white/30 hover:bg-[#20bd5a]"
      >
        WhatsApp · Employer
      </a>
      <a
        href={`https://wa.me/${whatsappE164}?text=${enc(waMsgJobseeker)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-slate-900 px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg ring-2 ring-white/20 hover:bg-slate-800"
      >
        WhatsApp · Job seeker
      </a>
    </div>
  );
}
