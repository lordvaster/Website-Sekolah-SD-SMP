// Author: Zeday | https://join.co.id
import fs from "node:fs/promises";
import path from "node:path";
import { defaultIcon, IconPresetKey, iconPresets } from "./icon-presets";

// SETTINGS_PATH memungkinkan test E2E (lihat playwright.config.ts) memakai
// file terpisah dari data/settings.json yang sungguhan, supaya menjalankan
// test tidak ikut mengubah pengaturan situs produksi yang sedang berjalan.
const settingsPath = process.env.SETTINGS_PATH
  ? path.resolve(process.env.SETTINGS_PATH)
  : path.join(process.cwd(), "data", "settings.json");
const DEFAULT_TAGLINE = "Belajar Seru, Tumbuh Percaya Diri";

export type SiteSettings = {
  activeIcon: IconPresetKey;
  siteTagline: string;
  updatedAt: string;
};

function defaultSettings(): SiteSettings {
  return {
    activeIcon: defaultIcon,
    siteTagline: DEFAULT_TAGLINE,
    updatedAt: new Date().toISOString(),
  };
}

export async function readSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    const parsed = JSON.parse(raw);

    if (!iconPresets[parsed.activeIcon as IconPresetKey]) {
      parsed.activeIcon = defaultIcon;
    }
    if (typeof parsed.siteTagline !== "string" || parsed.siteTagline.trim().length === 0) {
      parsed.siteTagline = DEFAULT_TAGLINE;
    }
    if (typeof parsed.updatedAt !== "string") {
      parsed.updatedAt = new Date().toISOString();
    }

    return parsed;
  } catch (error) {
    // ENOENT saat pertama kali dijalankan (file belum ada) itu wajar dan
    // diam-diam memakai default; error lain (JSON korup, izin baca) dicatat
    // agar tidak lolos tanpa jejak.
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
      console.error("[settings] Gagal membaca data/settings.json, memakai default:", error);
    }
    return defaultSettings();
  }
}

// Antrean sederhana in-process: setiap panggilan writeSettings dirangkai
// setelah panggilan sebelumnya selesai, supaya dua permintaan simpan yang
// datang hampir bersamaan (mis. dua tab admin) tidak saling menimpa lewat
// race read-modify-write. Tidak melindungi dari banyak instance server
// berjalan sekaligus - untuk itu perlu penyimpanan terpusat (bukan file).
let writeQueue: Promise<unknown> = Promise.resolve();

export function writeSettings(
  next: Partial<Pick<SiteSettings, "activeIcon" | "siteTagline">>
): Promise<SiteSettings> {
  const run = async () => {
    const current = await readSettings();
    const merged: SiteSettings = {
      ...current,
      ...next,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(settingsPath, JSON.stringify(merged, null, 2), "utf-8");
    return merged;
  };

  const result = writeQueue.then(run, run);
  // Rantai antrean harus tetap berjalan walau permintaan ini gagal, supaya
  // permintaan berikutnya tidak ikut macet menunggu promise yang reject.
  writeQueue = result.catch(() => {});
  return result;
}
