// Author: Zeday | https://join.co.id
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

const LocaleContext = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

// Locale ditentukan di server (cookie, lihat lib/i18n/get-locale.ts) dan
// diteruskan sekali dari app/(site)/layout.tsx - Client Component turunan
// (Navbar, Hero, form, dll) tinggal memakai useTranslation() tanpa perlu
// membaca cookie sendiri-sendiri, dan HTML yang dirender server sudah
// dalam bahasa yang benar sejak awal (tidak ada "kedipan" bahasa default).
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dict: dictionaries[locale] }}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation() harus dipakai di dalam <LocaleProvider>");
  }
  return ctx;
}
