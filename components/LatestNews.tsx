// Author: Zeday | https://join.co.id
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listNews } from "@/lib/repositories/news";
import SectionHeading from "./SectionHeading";
import NewsCard from "./NewsCard";
import RevealOnScroll from "./RevealOnScroll";

export default function LatestNews() {
  const latest = listNews().slice(0, 4);

  return (
    <section className="bg-secondary/5 py-16 dark:bg-secondary/10 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Info Terbaru"
            title="Berita & Pengumuman"
            align="left"
          />
          <Link
            href="/berita"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline dark:text-primary-light"
          >
            Lihat semua berita <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((article, i) => (
            <RevealOnScroll key={article.slug} delay={i * 0.07}>
              <NewsCard article={article} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
