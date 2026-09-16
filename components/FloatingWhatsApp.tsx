// Author: Zeday | https://join.co.id
"use client";

import { MessageCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  const { dict } = useTranslation();
  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.cta.ctaWhatsapp}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60" aria-hidden="true" />
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
