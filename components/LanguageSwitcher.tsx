// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, localeNames, localeShortNames, type Locale } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = useTranslation();
  const [busy, setBusy] = useState(false);

  const onChange = async (next: Locale) => {
    if (next === locale || busy) return;
    setBusy(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      // Server Component (layout, page) perlu dirender ulang dengan locale
      // baru - cookie sudah diset, refresh cukup tanpa navigasi penuh.
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex h-10 shrink-0 items-center gap-1 rounded-full px-2 ring-1 ring-black/10 dark:ring-white/20">
      <Languages className="h-4 w-4 shrink-0 text-ink/60 dark:text-ink-dark/60" aria-hidden="true" />
      <label className="sr-only" htmlFor="language-switcher">
        Pilih bahasa / Language
      </label>
      {/* Kode singkat ("ID"/"EN"), bukan nama penuh ("Indonesia"/"English") -
          supaya tidak meluber di navbar layar sempit (lihat localeShortNames). */}
      <select
        id="language-switcher"
        value={locale}
        disabled={busy}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="w-[3.5rem] appearance-none bg-transparent pr-1 text-sm font-semibold text-ink outline-none disabled:opacity-60 dark:text-ink-dark"
      >
        {locales.map((code) => (
          <option
            key={code}
            value={code}
            title={localeNames[code]}
            className="text-ink dark:bg-surface-dark dark:text-ink-dark"
          >
            {localeShortNames[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
