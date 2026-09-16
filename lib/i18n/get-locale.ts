// Author: Zeday | https://join.co.id
import { cookies } from "next/headers";
import { defaultLocale, dictionaries, locales, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return (locales as readonly string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}

export async function getDictionary() {
  return dictionaries[await getLocale()];
}
