// Author: Zeday | https://join.co.id
// Data statis yang belum (dan tidak perlu) dikelola lewat panel admin.
// Berita, galeri, profil guru, dan program sudah dipindah ke database -
// lihat lib/repositories/*.ts serta lib/seed.ts untuk data awalnya.

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  hue: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ibu Ratna, Wali Murid Kelas 2",
    role: "Orang Tua Siswa",
    quote: "Anak saya jadi jauh lebih percaya diri dan senang berangkat sekolah setiap hari. Guru-gurunya sangat perhatian.",
    hue: 205,
  },
  {
    name: "Bapak Yusuf, Wali Murid Kelas 5",
    role: "Orang Tua Siswa",
    quote: "Komunikasi sekolah dengan orang tua sangat baik, laporan perkembangan anak selalu jelas dan tepat waktu.",
    hue: 152,
  },
  {
    name: "Kayla, Siswa Kelas 4",
    role: "Siswa",
    quote: "Aku suka sekali sama kelas seni dan ekstrakurikuler renang di sekolah!",
    hue: 28,
  },
];

export type Extracurricular = { name: string; icon: "ball" | "paint" | "music" | "code" | "book" | "swim" };

export const extracurriculars: Extracurricular[] = [
  { name: "Futsal", icon: "ball" },
  { name: "Renang", icon: "swim" },
  { name: "Melukis", icon: "paint" },
  { name: "Paduan Suara", icon: "music" },
  { name: "Coding Dasar", icon: "code" },
  { name: "Klub Membaca", icon: "book" },
];

export const faqs = [
  { q: "Berapa usia minimal untuk mendaftar di TK A?", a: "Calon siswa TK A minimal berusia 4 tahun pada saat tahun ajaran dimulai." },
  { q: "Apakah sekolah menyediakan layanan antar jemput?", a: "Ya, sekolah bekerja sama dengan penyedia layanan antar jemput pihak ketiga untuk wilayah Palangkaraya dan sekitarnya." },
  { q: "Bagaimana cara mendaftar sebagai siswa baru?", a: "Pendaftaran dapat dilakukan online melalui halaman Kontak & Pendaftaran, atau datang langsung ke sekolah pada jam operasional." },
  { q: "Apakah ada program ekstrakurikuler wajib?", a: "Setiap siswa wajib memilih minimal satu ekstrakurikuler sesuai minat, mulai dari kelas 1." },
  { q: "Berapa jumlah maksimal siswa per kelas?", a: "Kami menjaga rasio ideal dengan maksimal 24 siswa per kelas agar guru dapat memberikan perhatian optimal." },
];

export const stats = [
  { label: "Siswa Aktif", value: 420 },
  { label: "Tenaga Pengajar", value: 38 },
  { label: "Tahun Berdiri", value: 2010 },
  { label: "Prestasi Diraih", value: 65 },
];
