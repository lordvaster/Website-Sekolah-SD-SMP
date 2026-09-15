// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import { listGalleryItems } from "@/lib/repositories/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Lihat momen keseruan aktivitas belajar, acara, dan kegiatan siswa SD Inovasi Ceria dalam galeri foto dan video.",
};

// Placeholder tunggal untuk contoh tampilan - tambahkan video YouTube resmi
// sekolah di sini (id unik per video) sebelum situs dipakai publik. Section
// ini belum bisa diedit lewat admin panel.
const videos = [{ id: "aqz-KE-bpKQ", title: "Profil Sekolah SD Inovasi Ceria (contoh)" }];

export default function GaleriPage() {
  const items = listGalleryItems();

  return (
    <>
      <Breadcrumb items={[{ label: "Galeri" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Dokumentasi"
            title="Galeri Foto Kegiatan Sekolah"
            description="Kumpulan momen berharga dari kegiatan kelas, acara, dan aktivitas siswa kami."
          />
          <div className="mt-10">
            <GalleryGrid items={items} />
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-14 dark:bg-primary/10 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Video Highlights" title="Video Kegiatan Sekolah" />
          <div className="mx-auto mt-10 grid max-w-xl gap-6 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.title} className="card overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <p className="p-4 font-heading font-bold text-ink dark:text-ink-dark">
                  {v.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
