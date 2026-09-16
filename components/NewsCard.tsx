// Author: Zeday | https://join.co.id
import Link from "next/link";
import type { NewsArticle } from "@/lib/repositories/news";
import { formatDate } from "@/lib/utils";
import MediaThumb from "./MediaThumb";

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/berita/${article.slug}`} className="card group block overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden">
        <MediaThumb
          imagePath={article.imagePath}
          hue={article.hue}
          label={article.category}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-secondary-dark dark:text-secondary-light">
          {article.category}
        </span>
        <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-ink dark:text-ink-dark">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink/70 dark:text-ink-dark/70">
          {article.excerpt}
        </p>
        <p className="mt-3 text-xs font-semibold text-ink/70 dark:text-ink-dark/50">
          {formatDate(article.date)} · {article.author}
        </p>
      </div>
    </Link>
  );
}
