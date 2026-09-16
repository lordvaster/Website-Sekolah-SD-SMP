// Author: Zeday | https://join.co.id
// Data statis yang belum (dan tidak perlu) dikelola lewat panel admin.
// Berita, galeri, profil guru, program, testimoni, dan FAQ sudah dipindah
// ke database - lihat lib/repositories/*.ts serta lib/seed.ts untuk data
// awalnya.

export type Extracurricular = { name: string; icon: "ball" | "paint" | "music" | "code" | "book" | "swim" };

export const extracurriculars: Extracurricular[] = [
  { name: "Futsal", icon: "ball" },
  { name: "Renang", icon: "swim" },
  { name: "Melukis", icon: "paint" },
  { name: "Paduan Suara", icon: "music" },
  { name: "Coding Dasar", icon: "code" },
  { name: "Klub Membaca", icon: "book" },
];

export const stats = [
  { label: "Siswa Aktif", value: 420 },
  { label: "Tenaga Pengajar", value: 38 },
  { label: "Tahun Berdiri", value: 2010 },
  { label: "Prestasi Diraih", value: 65 },
];
