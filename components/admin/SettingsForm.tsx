// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { iconPresets, type IconPresetKey } from "@/lib/icon-presets";
import type { SiteSettings } from "@/lib/settings";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [activeIcon, setActiveIcon] = useState<IconPresetKey>(initial.activeIcon);
  const [siteTagline, setSiteTagline] = useState(initial.siteTagline);
  const [schoolDescription, setSchoolDescription] = useState(initial.schoolDescription);
  const [schoolAddress, setSchoolAddress] = useState(initial.schoolAddress);
  const [schoolPhone, setSchoolPhone] = useState(initial.schoolPhone);
  const [schoolWhatsapp, setSchoolWhatsapp] = useState(initial.schoolWhatsapp);
  const [schoolEmail, setSchoolEmail] = useState(initial.schoolEmail);
  const [operationalHours, setOperationalHours] = useState(initial.operationalHours);
  const [socialInstagram, setSocialInstagram] = useState(initial.socialInstagram);
  const [socialFacebook, setSocialFacebook] = useState(initial.socialFacebook);
  const [socialYoutube, setSocialYoutube] = useState(initial.socialYoutube);
  const [mapsEmbedSrc, setMapsEmbedSrc] = useState(initial.mapsEmbedSrc);
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(initial.privacyPolicyContent);
  const [registrationDeadline, setRegistrationDeadline] = useState(initial.registrationDeadline);
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
        body: JSON.stringify({
          activeIcon,
          siteTagline,
          schoolDescription,
          schoolAddress,
          schoolPhone,
          schoolWhatsapp,
          schoolEmail,
          operationalHours,
          socialInstagram,
          socialFacebook,
          socialYoutube,
          mapsEmbedSrc,
          privacyPolicyContent,
          registrationDeadline,
        }),
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

  const inputClass =
    "mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark";

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
          className={`${inputClass} max-w-md`}
        />
        <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">
          Muncul di judul tab browser, hasil pencarian Google, dan logo navbar/footer. Perubahan tampil dalam waktu maksimal 1 menit (bukan instan seperti favicon).
        </p>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
          Informasi Kontak & Sosial Media
        </h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Tampil di footer setiap halaman dan halaman Kontak. Perubahan tampil seketika.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="schoolDescription" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              Deskripsi Singkat Sekolah
            </label>
            <textarea
              id="schoolDescription"
              rows={3}
              value={schoolDescription}
              onChange={(e) => setSchoolDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="schoolAddress" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              Alamat
            </label>
            <textarea
              id="schoolAddress"
              rows={2}
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="schoolPhone" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Telepon (tampilan)
              </label>
              <input
                id="schoolPhone"
                type="text"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                placeholder="(0274) 123-4567"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="schoolWhatsapp" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Nomor WhatsApp (untuk tombol chat)
              </label>
              <input
                id="schoolWhatsapp"
                type="text"
                value={schoolWhatsapp}
                onChange={(e) => setSchoolWhatsapp(e.target.value)}
                placeholder="6281234567890"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">
                Angka saja, diawali kode negara, tanpa spasi/tanda &quot;+&quot;.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="schoolEmail" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Email
              </label>
              <input
                id="schoolEmail"
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="operationalHours" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Jam Operasional
              </label>
              <input
                id="operationalHours"
                type="text"
                value={operationalHours}
                onChange={(e) => setOperationalHours(e.target.value)}
                placeholder="Senin - Jumat, 07.00 - 15.00 WIB"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="socialInstagram" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Instagram
              </label>
              <input
                id="socialInstagram"
                type="url"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="socialFacebook" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                Facebook
              </label>
              <input
                id="socialFacebook"
                type="url"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="socialYoutube" className="block text-sm font-semibold text-ink dark:text-ink-dark">
                YouTube
              </label>
              <input
                id="socialYoutube"
                type="url"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-ink/50 dark:text-ink-dark/50">
            Kosongkan salah satu media sosial untuk menyembunyikan ikonnya.
          </p>

          <div>
            <label htmlFor="mapsEmbedSrc" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              URL Embed Google Maps
            </label>
            <input
              id="mapsEmbedSrc"
              type="text"
              value={mapsEmbedSrc}
              onChange={(e) => setMapsEmbedSrc(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">
              Dari Google Maps: cari lokasi → Bagikan → Sematkan peta → salin URL di dalam <code>src=&quot;...&quot;</code>.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
          Countdown Pendaftaran
        </h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Jika diisi, hitung mundur menuju tanggal ini tampil di Beranda untuk mendorong calon
          pendaftar segera mendaftar. Kosongkan untuk menyembunyikan hitung mundur.
        </p>
        <div className="mt-4 max-w-xs">
          <label htmlFor="registrationDeadline" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Batas Akhir Pendaftaran
          </label>
          <input
            id="registrationDeadline"
            type="date"
            value={registrationDeadline}
            onChange={(e) => setRegistrationDeadline(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="privacyPolicyContent" className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
          Kebijakan Privasi
        </label>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Ditampilkan di halaman /kebijakan-privasi. Format teks sederhana: baris diawali{" "}
          <code>## </code> jadi judul bagian, baris diawali <code>- </code> jadi item daftar,
          baris kosong memisahkan paragraf. Tulis <code>{"{{email}}"}</code> atau{" "}
          <code>{"{{phone}}"}</code> untuk otomatis diganti email/telepon sekolah di atas.
        </p>
        <textarea
          id="privacyPolicyContent"
          value={privacyPolicyContent}
          onChange={(e) => setPrivacyPolicyContent(e.target.value)}
          rows={16}
          className={`${inputClass} font-mono text-xs`}
        />
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
