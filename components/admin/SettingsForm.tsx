// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { iconPresets, type IconPresetKey } from "@/lib/icon-presets";
import type { SiteSettings } from "@/lib/settings";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [activeIcon, setActiveIcon] = useState<IconPresetKey>(initial.activeIcon);
  const [siteTagline, setSiteTagline] = useState(initial.siteTagline);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeIcon, siteTagline }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal menyimpan pengaturan.");
      }
    } catch {
      setError("Gagal menyimpan pengaturan. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
          Favicon & Icon Situs
        </h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Pilih salah satu icon berikut. Perubahan berlaku otomatis di seluruh
          halaman tanpa perlu deploy ulang.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
          {(Object.keys(iconPresets) as IconPresetKey[]).map((key) => {
            const preset = iconPresets[key];
            const selected = activeIcon === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveIcon(key)}
                aria-pressed={selected}
                className={`flex flex-col items-center gap-2 rounded-xl2 p-3 ring-2 transition-all ${
                  selected ? "ring-primary" : "ring-transparent hover:ring-primary/30"
                }`}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ background: preset.bg }}
                >
                  <svg width="28" height="28" viewBox="0 0 64 64">
                    <path d={preset.svgPath} fill="white" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-ink dark:text-ink-dark">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Tagline Sekolah
        </label>
        <input
          id="tagline"
          type="text"
          value={siteTagline}
          onChange={(e) => setSiteTagline(e.target.value)}
          className="mt-1 w-full max-w-md rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">
          Muncul di judul tab browser, hasil pencarian Google, dan logo navbar/footer. Perubahan tampil dalam waktu maksimal 1 menit (bukan instan seperti favicon).
        </p>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button type="button" onClick={onSave} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving && <Loader2 className="h-5 w-5 animate-spin" />}
          Simpan Perubahan
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-semibold text-secondary-dark dark:text-secondary-light">
            <CheckCircle2 className="h-4 w-4" /> Tersimpan
          </span>
        )}
      </div>
    </div>
  );
}
