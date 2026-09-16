// Author: Zeday | https://join.co.id
import fs from "node:fs/promises";
import path from "node:path";
import { defaultIcon, IconPresetKey, iconPresets } from "./icon-presets";
import { siteConfig } from "./site-config";

// SETTINGS_PATH memungkinkan test E2E (lihat playwright.config.ts) memakai
// file terpisah dari data/settings.json yang sungguhan, supaya menjalankan
// test tidak ikut mengubah pengaturan situs produksi yang sedang berjalan.
const settingsPath = process.env.SETTINGS_PATH
  ? path.resolve(process.env.SETTINGS_PATH)
  : path.join(process.cwd(), "data", "settings.json");
const DEFAULT_TAGLINE = "Belajar Seru, Tumbuh Percaya Diri";

// Konten default Kebijakan Privasi, format teks ringan (bukan Markdown
// penuh): baris diawali "## " jadi judul bagian, baris diawali "- " jadi
// item daftar, sisanya jadi paragraf biasa (dipisah baris kosong). Lihat
// components/RichTextContent.tsx untuk parsernya. {{email}} dan {{phone}}
// otomatis diganti nilai kontak sekolah yang berlaku saat halaman dibuka.
const DEFAULT_PRIVACY_POLICY = `## 1. Data yang Kami Kumpulkan
Kami hanya mengumpulkan data yang anda berikan secara langsung lewat dua formulir di website ini:
- Formulir Kontak: nama, alamat email, nomor telepon, dan isi pesan anda.
- Formulir Pendaftaran Siswa Baru: nama dan usia calon siswa, jenjang yang dituju, serta nama, alamat email, dan nomor telepon orang tua/wali.

Kami tidak mengumpulkan data anda lewat cara lain dan tidak meminta data sensitif seperti NIK, data kesehatan, atau data keuangan lewat formulir ini.

## 2. Bagaimana Data Digunakan
Data dari Formulir Kontak diteruskan sebagai email ke alamat email pengelola sekolah untuk dijawab langsung - data ini tidak disimpan di database website.

Data dari Formulir Pendaftaran disimpan di database website agar dapat ditindaklanjuti oleh staf sekolah, dan dapat dilihat oleh staf yang memiliki akun admin di website ini.

## 3. Pemberitahuan ke Pihak Sekolah
Saat anda mengirim formulir pendaftaran, sistem dapat meneruskan notifikasi ke staf sekolah lewat email dan/atau WhatsApp (lewat layanan pihak ketiga). Pihak ketiga ini hanya menerima data secukupnya untuk mengirim notifikasi, dan tidak memiliki akses ke database website ini.

## 4. Penyimpanan & Keamanan Data
Data pendaftaran disimpan di server yang dilindungi koneksi terenkripsi (HTTPS). Akses ke panel admin dilindungi kata sandi per akun staf dan dapat ditambah verifikasi dua langkah (2FA); setiap perubahan data tercatat lengkap dengan siapa pelakunya.

Kami menyimpan data pendaftaran selama diperlukan untuk keperluan administrasi penerimaan siswa. Anda dapat meminta data dihapus lebih awal lewat kontak di bagian 6 di bawah.

## 5. Cookie & Analitik
Website ini menggunakan cookie teknis untuk sesi login admin (hanya relevan bagi staf sekolah) dan menyimpan preferensi mode terang/gelap di perangkat anda sendiri (tidak dikirim ke server).

Peta lokasi sekolah di halaman Kontak dimuat langsung dari Google Maps, yang tunduk pada kebijakan privasi Google sendiri saat peta tersebut dimuat di browser anda.

## 6. Hak Anda
Sesuai UU Pelindungan Data Pribadi, anda berhak untuk:
- Meminta salinan data pribadi anda yang kami simpan.
- Meminta koreksi data yang tidak akurat.
- Meminta penghapusan data pendaftaran anda dari sistem kami.
- Menarik persetujuan dan mengajukan keberatan atas penggunaan data anda.

Untuk menggunakan hak-hak ini, hubungi kami lewat {{email}} atau telepon {{phone}}. Kami akan menindaklanjuti permintaan anda dalam waktu yang wajar.

## 7. Perubahan Kebijakan Ini
Kami dapat memperbarui kebijakan ini sewaktu-waktu mengikuti perubahan layanan di website. Versi terbaru akan selalu tersedia di halaman ini.`;

export type SiteSettings = {
  activeIcon: IconPresetKey;
  siteTagline: string;
  schoolDescription: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolWhatsapp: string;
  schoolEmail: string;
  operationalHours: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  mapsEmbedSrc: string;
  privacyPolicyContent: string;
  updatedAt: string;
};

function defaultSettings(): SiteSettings {
  return {
    activeIcon: defaultIcon,
    siteTagline: DEFAULT_TAGLINE,
    schoolDescription: siteConfig.description,
    schoolAddress: siteConfig.address,
    schoolPhone: siteConfig.phone,
    schoolWhatsapp: siteConfig.whatsapp,
    schoolEmail: siteConfig.email,
    operationalHours: siteConfig.operationalHours,
    socialInstagram: siteConfig.social.instagram,
    socialFacebook: siteConfig.social.facebook,
    socialYoutube: siteConfig.social.youtube,
    mapsEmbedSrc: siteConfig.mapsEmbedSrc,
    privacyPolicyContent: DEFAULT_PRIVACY_POLICY,
    updatedAt: new Date().toISOString(),
  };
}

const STRING_FIELDS_WITH_DEFAULT: Record<
  Exclude<keyof SiteSettings, "activeIcon" | "updatedAt">,
  string
> = {
  siteTagline: DEFAULT_TAGLINE,
  schoolDescription: siteConfig.description,
  schoolAddress: siteConfig.address,
  schoolPhone: siteConfig.phone,
  schoolWhatsapp: siteConfig.whatsapp,
  schoolEmail: siteConfig.email,
  operationalHours: siteConfig.operationalHours,
  socialInstagram: siteConfig.social.instagram,
  socialFacebook: siteConfig.social.facebook,
  socialYoutube: siteConfig.social.youtube,
  mapsEmbedSrc: siteConfig.mapsEmbedSrc,
  privacyPolicyContent: DEFAULT_PRIVACY_POLICY,
};

export async function readSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    const parsed = JSON.parse(raw);

    if (!iconPresets[parsed.activeIcon as IconPresetKey]) {
      parsed.activeIcon = defaultIcon;
    }
    for (const [field, fallback] of Object.entries(STRING_FIELDS_WITH_DEFAULT)) {
      if (typeof parsed[field] !== "string" || parsed[field].trim().length === 0) {
        parsed[field] = fallback;
      }
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

export function writeSettings(next: Partial<Omit<SiteSettings, "updatedAt">>): Promise<SiteSettings> {
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
