// Author: Zeday | https://join.co.id
import fs from "node:fs/promises";
import path from "node:path";
import { defaultIcon, IconPresetKey, iconPresets } from "./icon-presets";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

export type SiteSettings = {
  activeIcon: IconPresetKey;
  siteTagline: string;
  updatedAt: string;
};

export async function readSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!iconPresets[parsed.activeIcon as IconPresetKey]) {
      parsed.activeIcon = defaultIcon;
    }
    return parsed;
  } catch {
    return {
      activeIcon: defaultIcon,
      siteTagline: "Belajar Seru, Tumbuh Percaya Diri",
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function writeSettings(
  next: Partial<Pick<SiteSettings, "activeIcon" | "siteTagline">>
): Promise<SiteSettings> {
  const current = await readSettings();
  const merged: SiteSettings = {
    ...current,
    ...next,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(settingsPath, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}
