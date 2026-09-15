// Author: Zeday | https://join.co.id
export const siteConfig = {
  name: "SD Inovasi Ceria",
  shortName: "SD Ceria",
  tagline: "Belajar Seru, Tumbuh Percaya Diri",
  description:
    "SD Inovasi Ceria adalah sekolah dasar yang memadukan kurikulum modern dengan suasana belajar yang ceria, aman, dan penuh percaya diri untuk anak usia 6-12 tahun di Palangkaraya.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sd.join.co.id",
  address: "Jl. Pendidikan No. 123, Palangkaraya, Kalimantan Tengah",
  phone: "(0274) 123-4567",
  whatsapp: "6281234567890",
  email: "info@sdceria.sch.id",
  operationalHours: "Senin - Jumat, 07.00 - 15.00 WIB",
  mapsEmbedSrc:
    process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.0!2d113.9213!3d-2.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPalangkaraya!5e0!3m2!1sid!2sid!4v1700000000000",
  social: {
    instagram: "https://instagram.com/sdinovasiceria",
    facebook: "https://facebook.com/sdinovasiceria",
    youtube: "https://youtube.com/@sdinovasiceria",
  },
  founded: 2010,
  developer: {
    name: "Zeday",
    url: "https://join.co.id",
  },
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Sekolah" },
  { href: "/program", label: "Program & Kelas" },
  { href: "/galeri", label: "Galeri" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
];
