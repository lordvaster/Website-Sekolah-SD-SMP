// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import MediaThumb from "@/components/MediaThumb";
import NewsCard from "@/components/NewsCard";
import SectionHeading from "@/components/SectionHeading";
import { getNewsBySlug, listNews } from "@/lib/repositories/news";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return listNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const related = listNews()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Berita", href: "/berita" },
          { label: article.title },
        ]}
      />

      <article className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wide text-secondary-dark dark:text-secondary-light">
            {article.category}
          </span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-ink dark:text-ink-dark sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm font-semibold text-ink/50 dark:text-ink-dark/50">
            {formatDate(article.date)} · Ditulis oleh {article.author}
          </p>

          <div className="mt-8 aspect-video overflow-hidden rounded-xl2">
            <MediaThumb
              imagePath={article.imagePath}
              hue={article.hue}
              label={article.category}
              className="h-full w-full"
            />
          </div>

          <div className="mt-8">
            {article.content.map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed text-ink/80 dark:text-ink-dark/80">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/berita"
            className="mt-8 inline-block font-semibold text-primary hover:underline dark:text-primary-light"
          >
            ← Kembali ke semua berita
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-primary/5 py-14 dark:bg-primary/10 sm:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Baca Juga" title="Berita Terkait" />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
