// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import NewsListWithSearch from "@/components/NewsListWithSearch";
import { listNews } from "@/lib/repositories/news";

export const metadata: Metadata = {
  title: "Berita & Blog",
  description:
    "Ikuti berita, prestasi, kegiatan, pengumuman, dan tips parenting terbaru dari SD Inovasi Ceria.",
};

export default function BeritaPage() {
  const articles = listNews();

  return (
    <>
      <Breadcrumb items={[{ label: "Berita" }]} />
      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Berita & Blog"
            title="Kabar Terbaru dari Sekolah"
            description="Informasi seputar prestasi, kegiatan, pengumuman, dan tips parenting untuk orang tua."
          />
          <div className="mt-10">
            <NewsListWithSearch articles={articles} />
          </div>
        </div>
      </section>
    </>
  );
}
