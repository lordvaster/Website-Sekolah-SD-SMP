// Author: Zeday | https://join.co.id
// Skema validasi untuk input dari panel admin (CRUD berita/galeri/guru/
// program), terpisah dari lib/validation.ts yang khusus untuk form publik.
import { z } from "zod";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => slugify(value));

export const newsAdminSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  excerpt: z.string().trim().min(10, "Ringkasan minimal 10 karakter").max(300),
  content: z
    .string()
    .trim()
    .min(10, "Isi berita minimal 10 karakter")
    .transform((value) =>
      value
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    ),
  category: z.enum(["Prestasi", "Kegiatan", "Pengumuman", "Tips Parenting"]),
  author: z.string().trim().min(2, "Nama penulis minimal 2 karakter").max(100),
  date: z.string().trim().min(1, "Tanggal wajib diisi"),
  imagePath: z.string().trim().nullable().optional(),
  slug: z.string().trim().optional(),
});

export const galleryAdminSchema = z.object({
  caption: z.string().trim().min(3, "Keterangan minimal 3 karakter").max(150),
  category: z.enum(["Kelas", "Acara", "Aktivitas"]),
  imagePath: z.string().trim().nullable().optional(),
});

export const teacherAdminSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  role: z.string().trim().min(2, "Jabatan minimal 2 karakter").max(100),
  subject: z.string().trim().min(2, "Bidang minimal 2 karakter").max(100),
  bio: z.string().trim().min(10, "Bio minimal 10 karakter").max(500),
  photoPath: z.string().trim().nullable().optional(),
  slug: z.string().trim().optional(),
});

export const programAdminSchema = z.object({
  name: z.string().trim().min(2, "Nama program minimal 2 karakter").max(100),
  ageRange: z.string().trim().min(2, "Rentang usia wajib diisi").max(50),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(500),
  highlights: z
    .string()
    .trim()
    .transform((value) =>
      value
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean)
    ),
  slug: z.string().trim().optional(),
});

export const testimonialAdminSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  role: z.string().trim().min(2, "Peran minimal 2 karakter").max(100),
  quote: z.string().trim().min(10, "Kutipan minimal 10 karakter").max(500),
  photoPath: z.string().trim().nullable().optional(),
});

export const faqAdminSchema = z.object({
  question: z.string().trim().min(5, "Pertanyaan minimal 5 karakter").max(300),
  answer: z.string().trim().min(5, "Jawaban minimal 5 karakter").max(1000),
});

export const achievementAdminSchema = z.object({
  title: z.string().trim().min(3, "Judul prestasi minimal 3 karakter").max(150),
  description: z.string().trim().min(5, "Keterangan minimal 5 karakter").max(300),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Tahun harus 4 digit angka, contoh: 2026"),
  imagePath: z.string().trim().nullable().optional(),
});

export function randomHue() {
  return Math.floor(Math.random() * 360);
}

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username minimal 3 karakter")
  .max(32, "Username maksimal 32 karakter")
  .regex(/^[a-z0-9._-]+$/, "Username hanya boleh huruf kecil, angka, titik, garis bawah, atau strip");

const passwordSchema = z.string().min(8, "Password minimal 8 karakter").max(200);

export const createUserSchema = z.object({
  username: usernameSchema,
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  password: passwordSchema,
  role: z.enum(["owner", "editor"]),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  role: z.enum(["owner", "editor"]),
  active: z.boolean(),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});
