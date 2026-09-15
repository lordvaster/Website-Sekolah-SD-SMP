// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import ExtracurricularIcon from "@/components/icons/ExtracurricularIcon";
import { extracurriculars, programs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Program & Kelas",
  description:
    "Jelajahi program TK A, TK B, hingga Kelas 1-6 beserta ekstrakurikuler dan timeline pembelajaran sepanjang tahun di SD Inovasi Ceria.",
};

const timeline = [
  { period: "Juli", title: "Masa Pengenalan Lingkungan Sekolah" },
  { period: "Agustus - Oktober", title: "Semester Ganjil: Pembelajaran Tematik" },
  { period: "November", title: "Penilaian Tengah Semester & Field Trip" },
  { period: "Desember", title: "Pentas Seni & Penerimaan Rapor" },
  { period: "Januari - Mei", title: "Semester Genap & Persiapan Lomba" },
  { period: "Juni", title: "Ujian Akhir & Kenaikan Kelas" },
];

export default function ProgramPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Program & Kelas" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Program Belajar"
            title="Program & Kelas Kami"
            description="Dari TK A hingga Kelas 6, setiap jenjang dirancang sesuai tahap perkembangan anak."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p, i) => (
              <RevealOnScroll key={p.slug} delay={(i % 4) * 0.06}>
                <div className="card overflow-hidden">
                  <div className="aspect-video">
                    <PlaceholderPhoto hue={p.hue} label={p.name} className="h-full w-full" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
                      {p.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary dark:text-primary-light">
                      Usia {p.ageRange}
                    </p>
                    <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
                      {p.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {p.highlights.map((h) => (
                        <li key={h} className="text-xs text-ink/60 dark:text-ink-dark/60">
                          • {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/10 py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Di Luar Kelas" title="Ekstrakurikuler Pilihan" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {extracurriculars.map((e, i) => (
              <RevealOnScroll key={e.name} delay={i * 0.05}>
                <div className="card flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent-dark dark:text-accent">
                    <ExtracurricularIcon icon={e.icon} className="h-7 w-7" />
                  </div>
                  <p className="font-heading text-sm font-bold text-ink dark:text-ink-dark">
                    {e.name}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Kalender Akademik" title="Timeline Pembelajaran Sepanjang Tahun" />
          <ol className="relative mt-12 space-y-10 border-s-2 border-primary/20 ps-6 dark:border-primary/30">
            {timeline.map((item, i) => (
              <RevealOnScroll key={item.period} delay={i * 0.06}>
                <li className="relative">
                  <span className="absolute -start-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-primary/20" />
                  <p className="text-xs font-bold uppercase tracking-wide text-primary dark:text-primary-light">
                    {item.period}
                  </p>
                  <p className="mt-1 font-heading font-bold text-ink dark:text-ink-dark">
                    {item.title}
                  </p>
                </li>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
