// Author: Zeday | https://join.co.id
// Data dummy awal, dimasukkan otomatis ke database sekali saja saat tabel
// terkait masih kosong (instalasi baru). Setelah itu semua perubahan
// dilakukan lewat panel admin, bukan lewat file ini.
import { db } from "./db";
import { createNews } from "./repositories/news";
import { createGalleryItem } from "./repositories/gallery";
import { createTeacher } from "./repositories/teachers";
import { createProgram } from "./repositories/programs";
import { createTestimonial } from "./repositories/testimonials";
import { createFaq } from "./repositories/faqs";
import { countAdminUsers, createAdminUser } from "./repositories/admin-users";

function count(table: string) {
  const row = db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get() as { c: number };
  return row.c;
}

function seedNews() {
  if (count("news") > 0) return;

  createNews({
    slug: "juara-1-lomba-sains-tingkat-kota",
    title: "Siswa SD Inovasi Ceria Raih Juara 1 Lomba Sains Tingkat Kota",
    excerpt:
      "Tim sains kelas 5 berhasil membawa pulang piala juara 1 dalam ajang Kompetisi Sains Anak Palangkaraya 2026.",
    content: [
      "Tim sains SD Inovasi Ceria yang terdiri dari tiga siswa kelas 5 berhasil meraih Juara 1 dalam Kompetisi Sains Anak tingkat Kota Palangkaraya yang diselenggarakan awal bulan ini.",
      "Para siswa mempresentasikan proyek sederhana tentang siklus air menggunakan alat peraga daur ulang, yang dinilai kreatif dan mudah dipahami oleh dewan juri.",
      "Kepala Sekolah, Ibu Sri Wahyuni, mengapresiasi kerja keras siswa dan bimbingan guru pendamping selama masa persiapan lomba.",
    ],
    category: "Prestasi",
    author: "Tim Humas",
    date: "2026-08-20",
    hue: 205,
  });

  createNews({
    slug: "kegiatan-market-day-kelas-3",
    title: "Serunya Market Day Kelas 3: Belajar Wirausaha Sejak Dini",
    excerpt:
      "Siswa kelas 3 berlatih berjualan dan mengelola uang saku dalam kegiatan Market Day yang diadakan di halaman sekolah.",
    content: [
      "Kegiatan Market Day menjadi salah satu program unggulan untuk mengenalkan konsep kewirausahaan kepada siswa sejak dini.",
      "Setiap kelompok siswa diberi modal awal untuk membuat dan menjual produk sederhana seperti kue kering dan kerajinan tangan.",
      "Selain melatih keberanian tampil, kegiatan ini juga mengajarkan pentingnya kerja sama tim dan pengelolaan keuangan sederhana.",
    ],
    category: "Kegiatan",
    author: "Dewi Lestari",
    date: "2026-08-12",
    hue: 152,
  });

  createNews({
    slug: "pendaftaran-siswa-baru-2027-dibuka",
    title: "Pendaftaran Siswa Baru Tahun Ajaran 2027/2028 Resmi Dibuka",
    excerpt: "SD Inovasi Ceria membuka pendaftaran untuk jenjang TK A hingga Kelas 6 mulai September ini.",
    content: [
      "Menyambut tahun ajaran baru 2027/2028, SD Inovasi Ceria membuka pendaftaran siswa baru mulai 1 September 2026.",
      "Calon siswa dapat mendaftar secara online melalui halaman Kontak & Pendaftaran di website ini, atau datang langsung ke sekolah pada jam operasional.",
      "Kuota penerimaan tahun ini terbatas untuk menjaga rasio ideal antara guru dan siswa di setiap kelas.",
    ],
    category: "Pengumuman",
    author: "Tim Admisi",
    date: "2026-09-01",
    hue: 28,
  });

  createNews({
    slug: "tips-membiasakan-anak-gemar-membaca",
    title: "5 Tips Membiasakan Anak Gemar Membaca di Rumah",
    excerpt: "Guru Bahasa Indonesia kami membagikan tips praktis agar anak semakin cinta membaca buku.",
    content: [
      "Membacakan cerita sebelum tidur secara rutin dapat menumbuhkan kecintaan anak pada buku sejak usia dini.",
      "Sediakan sudut baca yang nyaman di rumah dengan pencahayaan yang cukup dan pilihan buku sesuai usia anak.",
      "Jadilah teladan dengan menunjukkan kebiasaan membaca orang tua sendiri, karena anak belajar banyak dari contoh.",
    ],
    category: "Tips Parenting",
    author: "Dewi Lestari",
    date: "2026-07-28",
    hue: 265,
  });

  createNews({
    slug: "field-trip-kebun-raya",
    title: "Field Trip Seru ke Kebun Raya: Belajar Alam Langsung dari Sumbernya",
    excerpt:
      "Siswa kelas 4 dan 5 melakukan kunjungan edukatif ke Kebun Raya untuk mempelajari ekosistem tumbuhan.",
    content: [
      "Kegiatan field trip tahunan kali ini membawa siswa kelas 4 dan 5 mengunjungi Kebun Raya untuk belajar langsung tentang keanekaragaman hayati.",
      "Siswa diajak mengamati berbagai jenis tumbuhan, mencatat hasil observasi, dan berdiskusi kelompok tentang pentingnya menjaga lingkungan.",
      "Kegiatan ditutup dengan sesi berbagi cerita dan games edukatif bersama pemandu kebun raya.",
    ],
    category: "Kegiatan",
    author: "Hendra Saputra",
    date: "2026-06-15",
    hue: 190,
  });
}

function seedGallery() {
  if (count("gallery_items") > 0) return;

  const items: { caption: string; category: "Kelas" | "Acara" | "Aktivitas" }[] = [
    { caption: "Suasana belajar Kelas 1", category: "Kelas" },
    { caption: "Praktik sains sederhana", category: "Kelas" },
    { caption: "Kegiatan mewarnai TK A", category: "Kelas" },
    { caption: "Upacara bendera hari Senin", category: "Acara" },
    { caption: "Perayaan Hari Kemerdekaan", category: "Acara" },
    { caption: "Pentas seni akhir tahun", category: "Acara" },
    { caption: "Wisuda TK B", category: "Acara" },
    { caption: "Market Day kelas 3", category: "Aktivitas" },
    { caption: "Ekstrakurikuler renang", category: "Aktivitas" },
    { caption: "Latihan futsal sore hari", category: "Aktivitas" },
    { caption: "Klub melukis", category: "Aktivitas" },
    { caption: "English Club Jumat ceria", category: "Aktivitas" },
    { caption: "Field trip Kebun Raya", category: "Acara" },
    { caption: "Lomba mewarnai 17-an", category: "Acara" },
    { caption: "Kegiatan literasi pagi", category: "Kelas" },
    { caption: "Belajar coding dasar", category: "Kelas" },
    { caption: "Senam pagi bersama", category: "Aktivitas" },
    { caption: "Kunjungan perpustakaan kota", category: "Aktivitas" },
    { caption: "Pameran karya siswa", category: "Acara" },
    { caption: "Kegiatan gotong royong sekolah", category: "Aktivitas" },
  ];

  items.forEach((item, i) => {
    createGalleryItem({ ...item, hue: (i * 47) % 360 });
  });
}

function seedTeachers() {
  if (count("teachers") > 0) return;

  const teachers = [
    { slug: "ibu-sri-wahyuni", name: "Sri Wahyuni, S.Pd", role: "Kepala Sekolah", subject: "Manajemen Pendidikan", hue: 205, bio: "Memimpin SD Inovasi Ceria sejak 2015 dengan fokus pada pembelajaran berbasis karakter." },
    { slug: "pak-budi-santoso", name: "Budi Santoso, S.Pd", role: "Wali Kelas 1", subject: "Tematik", hue: 152, bio: "Berpengalaman 10 tahun mendampingi siswa kelas awal beradaptasi dengan dunia sekolah." },
    { slug: "ibu-dewi-lestari", name: "Dewi Lestari, S.Pd", role: "Wali Kelas 2", subject: "Bahasa Indonesia", hue: 28, bio: "Menyukai metode storytelling untuk menumbuhkan minat baca siswa." },
    { slug: "pak-agus-purnomo", name: "Agus Purnomo, S.Si", role: "Guru Matematika", subject: "Matematika", hue: 0, bio: "Mengajarkan matematika dengan pendekatan permainan agar anak tidak takut angka." },
    { slug: "ibu-rina-anggraini", name: "Rina Anggraini, S.Pd", role: "Guru Bahasa Inggris", subject: "Bahasa Inggris", hue: 265, bio: "Aktif mengadakan English Club setiap hari Jumat untuk melatih percakapan siswa." },
    { slug: "pak-hendra-saputra", name: "Hendra Saputra, S.Or", role: "Guru Olahraga", subject: "Pendidikan Jasmani", hue: 190, bio: "Melatih tim futsal dan renang sekolah yang rutin mengikuti kejuaraan antar SD." },
    { slug: "ibu-nur-fadilah", name: "Nur Fadilah, S.Pd", role: "Guru Seni & Budaya", subject: "Seni Rupa & Musik", hue: 320, bio: "Membimbing siswa dalam paduan suara dan pameran karya seni tahunan." },
    { slug: "pak-fajar-ramadhan", name: "Fajar Ramadhan, S.Kom", role: "Guru Komputer", subject: "Teknologi Informasi", hue: 45, bio: "Mengenalkan coding dasar dan literasi digital sejak kelas 3." },
  ];

  teachers.forEach((t) => createTeacher(t));
}

function seedPrograms() {
  if (count("programs") > 0) return;

  const programs = [
    { slug: "tk-a", name: "TK A", ageRange: "4-5 tahun", description: "Pengenalan huruf, angka, dan kemandirian dasar melalui bermain sambil belajar.", highlights: ["Motorik halus & kasar", "Pengenalan huruf & angka", "Bermain kelompok"], hue: 205 },
    { slug: "tk-b", name: "TK B", ageRange: "5-6 tahun", description: "Persiapan menuju sekolah dasar dengan penguatan literasi dan numerasi awal.", highlights: ["Calistung dasar", "Kemandirian sosial", "Proyek tema mingguan"], hue: 152 },
    { slug: "kelas-1", name: "Kelas 1", ageRange: "6-7 tahun", description: "Fokus pada penguatan membaca, menulis, dan berhitung dengan pendekatan tematik.", highlights: ["Tematik terpadu", "Literasi & numerasi", "Pembiasaan karakter"], hue: 28 },
    { slug: "kelas-2", name: "Kelas 2", ageRange: "7-8 tahun", description: "Pengembangan kemampuan akademik dasar sambil membangun rasa ingin tahu.", highlights: ["Sains sederhana", "Proyek kelompok", "Klub membaca"], hue: 0 },
    { slug: "kelas-3", name: "Kelas 3", ageRange: "8-9 tahun", description: "Penguatan kemampuan berpikir kritis melalui proyek dan eksperimen ringan.", highlights: ["Eksperimen sains", "Market Day", "Presentasi kelompok"], hue: 265 },
    { slug: "kelas-4", name: "Kelas 4", ageRange: "9-10 tahun", description: "Pendalaman materi akademik dengan kegiatan eksplorasi dan diskusi kelas.", highlights: ["Riset sederhana", "Diskusi kelas", "Kunjungan edukatif"], hue: 190 },
    { slug: "kelas-5", name: "Kelas 5", ageRange: "10-11 tahun", description: "Persiapan kompetisi akademik dan pengembangan kepemimpinan siswa.", highlights: ["Lomba akademik", "Kepemimpinan siswa", "Proyek sains"], hue: 320 },
    { slug: "kelas-6", name: "Kelas 6", ageRange: "11-12 tahun", description: "Persiapan kelulusan dan transisi ke jenjang SMP dengan bimbingan intensif.", highlights: ["Bimbingan kelulusan", "Konseling transisi SMP", "Proyek akhir"], hue: 45 },
  ];

  programs.forEach((p) => createProgram(p));
}

function seedTestimonials() {
  if (count("testimonials") > 0) return;

  const testimonials = [
    {
      name: "Ibu Ratna, Wali Murid Kelas 2",
      role: "Orang Tua Siswa",
      quote:
        "Anak saya jadi jauh lebih percaya diri dan senang berangkat sekolah setiap hari. Guru-gurunya sangat perhatian.",
      hue: 205,
    },
    {
      name: "Bapak Yusuf, Wali Murid Kelas 5",
      role: "Orang Tua Siswa",
      quote:
        "Komunikasi sekolah dengan orang tua sangat baik, laporan perkembangan anak selalu jelas dan tepat waktu.",
      hue: 152,
    },
    {
      name: "Kayla, Siswa Kelas 4",
      role: "Siswa",
      quote: "Aku suka sekali sama kelas seni dan ekstrakurikuler renang di sekolah!",
      hue: 28,
    },
  ];

  testimonials.forEach((t) => createTestimonial(t));
}

function seedFaqs() {
  if (count("faqs") > 0) return;

  const faqs = [
    { question: "Berapa usia minimal untuk mendaftar di TK A?", answer: "Calon siswa TK A minimal berusia 4 tahun pada saat tahun ajaran dimulai." },
    { question: "Apakah sekolah menyediakan layanan antar jemput?", answer: "Ya, sekolah bekerja sama dengan penyedia layanan antar jemput pihak ketiga untuk wilayah Palangkaraya dan sekitarnya." },
    { question: "Bagaimana cara mendaftar sebagai siswa baru?", answer: "Pendaftaran dapat dilakukan online melalui halaman Kontak & Pendaftaran, atau datang langsung ke sekolah pada jam operasional." },
    { question: "Apakah ada program ekstrakurikuler wajib?", answer: "Setiap siswa wajib memilih minimal satu ekstrakurikuler sesuai minat, mulai dari kelas 1." },
    { question: "Berapa jumlah maksimal siswa per kelas?", answer: "Kami menjaga rasio ideal dengan maksimal 24 siswa per kelas agar guru dapat memberikan perhatian optimal." },
  ];

  faqs.forEach((f) => createFaq(f));
}

// Akun admin pertama ("owner") dibuat sekali dari ADMIN_PASSWORD di .env,
// supaya deployment yang sudah ada (dari sebelum fitur multi-akun ini)
// tidak langsung terkunci begitu update di-deploy. Setelah ini, kelola
// akun (tambah staf, ganti password/role) lewat /admin/pengguna - env var
// ADMIN_PASSWORD tidak dibaca lagi untuk login setelah baris ini jalan
// sekali, hanya masih dipakai sebagai kunci penandatanganan token sesi
// (lihat lib/admin-auth.ts).
async function seedOwnerAccount() {
  if (countAdminUsers() > 0) return;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error(
      "[seed] ADMIN_PASSWORD kosong - tidak bisa membuat akun admin pertama. " +
        "Isi ADMIN_PASSWORD di .env lalu restart server."
    );
    return;
  }

  await createAdminUser({ username: "admin", name: "Admin", password, role: "owner" });
}

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  seeded = true;
  seedNews();
  seedGallery();
  seedTeachers();
  seedPrograms();
  seedTestimonials();
  seedFaqs();
  // Di-await (bukan fire-and-forget) - lihat instrumentation.ts: register()
  // harus benar-benar selesai, termasuk bagian async ini, sebelum server
  // mulai menerima request, supaya tidak ada window tanpa akun admin sama
  // sekali saat request login pertama masuk.
  await seedOwnerAccount();
}
