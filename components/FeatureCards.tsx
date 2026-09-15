// Author: Zeday | https://join.co.id
import { BookOpen, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";
import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: BookOpen,
    title: "Kurikulum Modern",
    desc: "Memadukan kurikulum nasional dengan pembelajaran berbasis proyek yang menyenangkan.",
  },
  {
    icon: ShieldCheck,
    title: "Lingkungan Aman",
    desc: "Area sekolah diawasi penuh dengan protokol keamanan yang jelas untuk setiap siswa.",
  },
  {
    icon: Users,
    title: "Guru Berpengalaman",
    desc: "Tenaga pengajar tersertifikasi yang peduli pada perkembangan setiap anak.",
  },
  {
    icon: Sparkles,
    title: "Ekstrakurikuler Beragam",
    desc: "Beragam pilihan kegiatan untuk mengasah bakat dan minat siswa di luar akademik.",
  },
  {
    icon: HeartHandshake,
    title: "Komunikasi Orang Tua",
    desc: "Laporan perkembangan siswa yang transparan dan mudah diakses kapan saja.",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Keunggulan Kami"
          title="Mengapa Memilih SD Inovasi Ceria?"
          description="Kami percaya setiap anak berhak mendapatkan pengalaman belajar terbaik yang menumbuhkan rasa percaya diri."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 0.07}>
              <div className="card h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-ink dark:text-ink-dark">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-ink-dark/70">
                  {f.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
