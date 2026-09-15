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

export function randomHue() {
  return Math.floor(Math.random() * 360);
}
