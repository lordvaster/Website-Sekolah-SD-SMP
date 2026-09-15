// Author: Zeday | https://join.co.id
// Favicon dinamis: dibaca dari data/settings.json sehingga bisa diganti
// lewat halaman admin (/admin/pengaturan) tanpa perlu deploy ulang.
import { ImageResponse } from "next/og";
import { readSettings } from "@/lib/settings";
import { iconPresets } from "@/lib/icon-presets";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const settings = await readSettings();
  const preset = iconPresets[settings.activeIcon];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: preset.bg,
          borderRadius: 14,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d={preset.svgPath} fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
