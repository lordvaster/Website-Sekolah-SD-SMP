// Author: Zeday | https://join.co.id
"use client";

import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function SkipToContent() {
  const { dict } = useTranslation();
  return (
    <a href="#konten-utama" className="skip-link">
      {dict.common.skipToContent}
    </a>
  );
}
