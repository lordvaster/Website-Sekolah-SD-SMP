// Author: Zeday | https://join.co.id
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary.DEFAULT & cta.DEFAULT digelapkan dari warna aslinya
        // (#4A90E2 / #FF6B6B) - warna asli gagal rasio kontras WCAG AA
        // (4.5:1) sebagai teks/tombol di atas latar terang, ditemukan lewat
        // audit Lighthouse (lihat riwayat commit). primary.light tidak
        // diubah - dipakai khusus di dark mode (teks terang di atas latar
        // gelap), sudah jauh di atas ambang kontras. Nilai primary.DEFAULT
        // digelapkan dua kali - percobaan pertama (#2B6CB0) lolos di
        // sebagian besar tempat tapi masih tipis gagal (4.35, butuh 4.5)
        // di tombol filter kategori Galeri (latar bg-primary/10 yang
        // sedikit lebih gelap dari perkiraan awal) - #265D95 punya margin
        // lebih aman di semua kombinasi latar yang dipakai di situs ini.
        primary: {
          DEFAULT: "#265D95",
          dark: "#1E4A77",
          light: "#7CB0EC",
        },
        secondary: {
          DEFAULT: "#3DBE85",
          dark: "#2E9668",
          light: "#7FDCB0",
        },
        // accent.dark digelapkan (#F2971A->#8A5A0A) - dipakai sebagai teks
        // label eyebrow (mis. "Keunggulan Kami") di atas bg-accent/15,
        // versi asli cuma kontras ~1.9:1 (butuh 4.5:1), gagal audit
        // Lighthouse paling parah dari semua temuan color-contrast.
        accent: {
          DEFAULT: "#FFB84D",
          dark: "#8A5A0A",
          light: "#FFD08A",
        },
        cta: {
          DEFAULT: "#CC3D3D",
          dark: "#AD3434",
        },
        surface: {
          DEFAULT: "#F5F5F5",
          dark: "#151A21",
        },
        ink: {
          DEFAULT: "#333333",
          dark: "#EDEEF0",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
