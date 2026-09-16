// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import type { NewsArticle, NewsCategory } from "@/lib/repositories/news";

const categories: NewsCategory[] = ["Prestasi", "Kegiatan", "Pengumuman", "Tips Parenting"];

export default function NewsForm({ initial }: { initial?: NewsArticle }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content.join("\n\n") ?? "");
  const [category, setCategory] = useState<NewsCategory>(initial?.category ?? "Kegiatan");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [imagePath, setImagePath] = useState<string | null>(initial?.imagePath ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/news/${initial.id}` : "/api/admin/news";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, category, author, date, imagePath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan berita.");
        return;
      }
      router.push("/admin/berita");
      router.refresh();
    } catch {
      setError("Gagal menyimpan berita. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ImageUploadField
        label="Gambar Sampul"
        folder="news"
        value={imagePath}
        onChange={setImagePath}
        placeholderLabel={category}
        placeholderHue={initial?.hue ?? 205}
      />

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Judul
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as NewsCategory)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Tanggal
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Penulis
        </label>
        <input
          id="author"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 w-full max-w-sm rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Ringkasan
        </label>
        <textarea
          id="excerpt"
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        <p className="mt-1 text-xs text-ink/70 dark:text-ink-dark/50">
          Tampil di kartu berita &amp; hasil pencarian Google.
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Isi Berita
        </label>
        <textarea
          id="content"
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        <p className="mt-1 text-xs text-ink/70 dark:text-ink-dark/50">
          Pisahkan tiap paragraf dengan baris kosong.
        </p>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Terbitkan Berita"}
      </button>
    </form>
  );
}
