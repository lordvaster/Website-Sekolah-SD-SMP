// Author: Zeday | https://join.co.id
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { NewsArticle } from "@/lib/repositories/news";
import NewsCard from "./NewsCard";

const categories = ["Semua", "Prestasi", "Kegiatan", "Pengumuman", "Tips Parenting"] as const;

export default function NewsListWithSearch({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory = category === "Semua" || article.category === category;
      const matchQuery =
        query.trim().length === 0 ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [articles, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full max-w-sm">
          <span className="sr-only">Cari berita</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita..."
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary/20 dark:text-primary-light"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-ink/60 dark:text-ink-dark/60">
          Tidak ada berita yang cocok dengan pencarian anda.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
