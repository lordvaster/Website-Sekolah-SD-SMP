// Author: Zeday | https://join.co.id
"use client";

import { Languages } from "lucide-react";
import { locales, localeNames, localeShortNames, type Locale } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="relative flex h-10 shrink-0 items-center gap-1 rounded-full px-2 ring-1 ring-black/10 dark:ring-white/20">
      <Languages className="h-4 w-4 shrink-0 text-ink/70 dark:text-ink-dark/60" aria-hidden="true" />
      <label className="sr-only" htmlFor="language-switcher">
        Pilih bahasa / Language
      </label>
      {/* Kode singkat ("ID"/"EN"), bukan nama penuh ("Indonesia"/"English") -
          supaya tidak meluber di navbar layar sempit (lihat localeShortNames). */}
      <select
        id="language-switcher"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="w-[3.5rem] appearance-none bg-transparent pr-1 text-sm font-semibold text-ink outline-none dark:text-ink-dark"
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
