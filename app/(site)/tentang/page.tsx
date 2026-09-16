// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import TeacherGrid from "@/components/TeacherGrid";
import AchievementGrid from "@/components/AchievementGrid";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tentang Sekolah",
  description:
    "Kenali sejarah, visi misi, fasilitas, kurikulum, dan tim pengajar SD Inovasi Ceria Palangkaraya.",
};

const facilities = [
  { name: "Ruang Kelas Ber-AC", hue: 205 },
  { name: "Perpustakaan Anak", hue: 152 },
  { name: "Laboratorium Komputer", hue: 28 },
  { name: "Lapangan Olahraga", hue: 0 },
  { name: "Kolam Renang", hue: 190 },
  { name: "Ruang Seni & Musik", hue: 320 },
];

const curriculumPoints = [
  "Kurikulum Merdeka dipadukan dengan pembelajaran berbasis proyek (project-based learning).",
  "Pembelajaran tematik yang mengaitkan materi dengan kehidupan sehari-hari anak.",
  "Penilaian holistik yang memperhatikan aspek akademik, sosial, dan emosional siswa.",
  "Kelas kecil dengan rasio maksimal 24 siswa per guru untuk perhatian yang lebih personal.",
];

export default function TentangPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Tentang Sekolah" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Sejarah Kami"
              title="Perjalanan SD Inovasi Ceria"
              align="left"
            />
            <p className="mt-4 text-ink/70 dark:text-ink-dark/70">
              Didirikan pada tahun {siteConfig.founded}, {siteConfig.name} lahir
              dari semangat untuk menghadirkan pendidikan dasar yang tidak
              hanya unggul secara akademik, tetapi juga menyenangkan bagi
              anak-anak. Berawal dari dua ruang kelas sederhana, kini kami
              telah berkembang menjadi sekolah dengan fasilitas lengkap yang
              dipercaya ratusan keluarga di Palangkaraya.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <h3 className="font-heading font-bold text-primary dark:text-primary-light">
                  Visi
                </h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
                  Menjadi sekolah dasar terdepan yang mencetak generasi
                  cerdas, kreatif, dan berkarakter.
                </p>
              </div>
              <div className="card p-5">
                <h3 className="font-heading font-bold text-primary dark:text-primary-light">
                  Misi
                </h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
                  Menyelenggarakan pembelajaran yang aktif, inklusif, dan
                  berpusat pada kebutuhan setiap anak.
                </p>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="aspect-[4/3] overflow-hidden rounded-xl2 shadow-md">
              <PlaceholderPhoto hue={205} label="Gedung Sekolah" className="h-full w-full" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-primary/5 py-14 dark:bg-primary/10 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll className="order-2 lg:order-1">
            <div className="aspect-square w-full max-w-sm overflow-hidden rounded-xl2 shadow-md">
              <PlaceholderPhoto
                hue={152}
                label="Kepala Sekolah"
                variant="avatar"
                className="h-full w-full"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Profil Pimpinan"
              title="Sambutan Kepala Sekolah"
              align="left"
            />
            <p className="mt-4 text-ink/70 dark:text-ink-dark/70">
              &ldquo;Setiap anak memiliki keunikan dan potensinya masing-masing.
              Tugas kami sebagai pendidik adalah menemukan dan
              mengembangkannya dengan penuh kasih sayang, kesabaran, dan
              metode belajar yang tepat.&rdquo;
            </p>
            <p className="mt-4 font-heading font-bold text-ink dark:text-ink-dark">
              Sri Wahyuni, S.Pd
            </p>
            <p className="text-sm text-ink/70 dark:text-ink-dark/60">
              Kepala Sekolah SD Inovasi Ceria
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Fasilitas" title="Fasilitas Sekolah yang Lengkap" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <RevealOnScroll key={f.name} delay={i * 0.06}>
                <div className="card overflow-hidden">
                  <div className="aspect-video">
                    <PlaceholderPhoto hue={f.hue} label={f.name} className="h-full w-full" />
                  </div>
                  <p className="p-4 font-heading font-bold text-ink dark:text-ink-dark">
                    {f.name}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Prestasi" title="Prestasi & Penghargaan" />
          <div className="mt-10">
            <AchievementGrid />
          </div>
        </div>
      </section>

      <section className="bg-secondary/5 py-14 dark:bg-secondary/10 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Kurikulum"
              title="Kurikulum & Metode Belajar"
              align="left"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <ul className="space-y-4">
              {curriculumPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary-dark dark:text-secondary-light" />
                  <span className="text-ink/80 dark:text-ink-dark/80">{point}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Tim Pengajar" title="Guru-Guru Kami" />
          <div className="mt-10">
            <TeacherGrid />
          </div>
        </div>
      </section>
    </>
  );
}
