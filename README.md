# SD Inovasi Ceria — Website Sekolah

Website resmi SD Inovasi Ceria: "Belajar Seru, Tumbuh Percaya Diri".
Dibangun dengan Next.js 14 (App Router), React 18, dan TailwindCSS.

Dikembangkan oleh **Zeday** — [https://join.co.id](https://join.co.id)

## Fitur Utama

- Halaman: Beranda, Tentang Sekolah, Program & Kelas, Galeri, Berita/Blog, Kontak & Pendaftaran.
- Dark mode toggle (default: light mode), fully responsive (mobile-first).
- SEO: metadata per halaman, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`.
- Aksesibilitas: skip-to-content, label ARIA, kontras warna sesuai WCAG AA, navigasi keyboard.
- Form kontak & pendaftaran siswa baru dengan validasi real-time (React Hook Form + Zod) dan email konfirmasi (opsional, via SMTP).
- Galeri foto dengan filter kategori & lightbox, video YouTube embed.
- PWA dasar: manifest + service worker untuk caching offline halaman utama.
- Favicon/icon situs dapat diganti langsung dari halaman admin (`/admin`) tanpa perlu deploy ulang.

## Menjalankan Secara Lokal

```bash
npm install
cp .env.example .env   # lalu isi sesuai kebutuhan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Konfigurasi Environment (`.env`)

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domain produksi, contoh `https://sd.join.co.id` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Untuk mengaktifkan email konfirmasi form kontak/pendaftaran. Jika kosong, form tetap berfungsi namun email tidak terkirim (hanya dicatat di log server). |
| `CONTACT_RECEIVER_EMAIL` | Email tujuan penerima pesan kontak & pendaftaran. |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics (opsional). |
| `NEXT_PUBLIC_MAPS_EMBED_SRC` | URL embed Google Maps lokasi sekolah. |
| `ADMIN_PASSWORD` | Password untuk masuk ke `/admin` (wajib diisi sebelum deploy produksi). |

## Mengganti Konten

Sebagian besar data dummy berada di [`lib/data.ts`](lib/data.ts) (berita, guru, galeri, testimoni, program) dan [`lib/site-config.ts`](lib/site-config.ts) (nama sekolah, alamat, kontak, sosial media). Edit file tersebut lalu deploy ulang untuk memperbarui konten.

Foto/galeri saat ini menggunakan placeholder SVG generatif (tanpa file gambar) agar situs tetap ringan. Untuk mengganti dengan foto asli:
1. Simpan foto di folder `public/images/`.
2. Ganti komponen `PlaceholderPhoto` dengan komponen `next/image` yang menunjuk ke file tersebut pada bagian yang relevan.

## Admin: Mengganti Favicon

1. Buka `https://domain-anda/admin`.
2. Masuk menggunakan `ADMIN_PASSWORD` yang sudah diatur di environment.
3. Pilih salah satu preset icon, ubah tagline jika perlu, lalu klik **Simpan Perubahan**.

Favicon akan langsung berubah di seluruh situs tanpa perlu build ulang.

## Build & Deploy

```bash
npm run build
npm run start
```

Direkomendasikan deploy ke [Vercel](https://vercel.com) (platform resmi Next.js):

1. Push repository ke GitHub.
2. Import project di Vercel, isi Environment Variables sesuai `.env.example`.
3. Arahkan domain `sd.join.co.id` ke deployment Vercel (tambahkan CNAME/A record sesuai instruksi Vercel).

Bisa juga dijalankan di server Node.js sendiri (VPS) menggunakan `npm run build && npm run start`, idealnya di belakang reverse proxy (Nginx) dengan HTTPS.

## Tips Maintenance

- **Update berita/prestasi**: tambahkan entri baru di array `newsArticles` pada `lib/data.ts`.
- **Tambah/ubah guru**: edit array `teachers` pada `lib/data.ts`.
- **Cek broken link & SEO** secara berkala dengan Google Search Console.
- **Backup** `data/settings.json` sebelum melakukan deploy besar, karena file ini menyimpan preferensi favicon dari admin.
- **Perbarui dependency** secara berkala dengan `npm outdated` dan `npm update` untuk menjaga keamanan.
- Untuk skala trafik besar, ganti rate-limiter sederhana di `lib/rate-limit.ts` dengan solusi terdistribusi (mis. Upstash Redis).

## Struktur Folder Singkat

```
app/            Halaman & route (App Router)
  api/          Route handler (contact, pendaftaran, settings, admin auth)
  admin/        Halaman login & pengaturan admin
components/     Komponen React yang dapat dipakai ulang
lib/            Data dummy, konfigurasi situs, util, validasi
data/           settings.json (state favicon/tagline, diubah lewat admin)
public/         Aset statis & service worker (sw.js)
```
