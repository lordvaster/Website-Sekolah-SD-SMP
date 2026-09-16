// Author: Zeday | https://join.co.id
"use client";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { defaultLocale, dictionaries, locales, type Dictionary, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "locale";

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return (locales as readonly string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

// Locale SENGAJA tidak lagi dibaca dari cookie di server (lewat cookies()
// dari next/headers) - itu memaksa Next.js merender seluruh rute secara
// dinamis per-request (menghapus caching statis/ISR di semua halaman
// publik, ditemukan lewat audit Lighthouse: header respons jadi
// "Cache-Control: private, no-store" dan metadata <head> jadi terlambat
// muncul). Semua halaman sekarang dirender statis dalam bahasa default
// (Indonesia), lalu locale sungguhan dibaca dari cookie DI SINI, di
// client, lewat useLayoutEffect - efek itu berjalan setelah DOM
// diperbarui tapi SEBELUM browser menggambar frame pertama, jadi untuk
// pengunjung yang sebelumnya memilih bahasa lain, koreksi ke bahasa yang
// benar terjadi sebelum sempat terlihat (mirip teknik next-themes
// menghindari "kedipan" tema, diterapkan di sini untuk teks terjemahan).
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useLayoutEffect(() => {
    // Sengaja setState sinkron di sini (bukan pola "setState di dalam
    // callback" yang disarankan linter react-hooks/set-state-in-effect):
    // ini menyinkronkan dengan sumber eksternal (cookie) yang nilainya
    // hanya bisa diketahui di client, dan HARUS dikoreksi sebelum browser
    // menggambar frame pertama - menundanya (mis. lewat setTimeout) akan
    // membuat "kedipan" bahasa yang justru ingin dihindari (lihat komentar
    // besar di atas komponen ini).
    const fromCookie = readLocaleCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromCookie !== defaultLocale) setLocaleState(fromCookie);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    // Bukan httpOnly - preferensi bahasa bukan data sensitif, dan memang
    // perlu ditulis dari client agar pilihan bahasa instan tanpa round-trip
    // ke server (lihat LanguageSwitcher.tsx).
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  return (
    <LocaleContext.Provider value={{ locale, dict: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation() harus dipakai di dalam <LocaleProvider>");
  }
  return ctx;
}
