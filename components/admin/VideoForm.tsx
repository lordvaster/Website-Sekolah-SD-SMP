// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import type { Video, VideoCategory } from "@/lib/repositories/videos";

const categories: VideoCategory[] = ["Profil Sekolah", "Testimoni", "Virtual Tour"];

export default function VideoForm({ initial }: { initial?: Video }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [youtubeId, setYoutubeId] = useState(initial?.youtubeId ?? "");
  const [category, setCategory] = useState<VideoCategory>(initial?.category ?? "Profil Sekolah");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/videos/${initial.id}` : "/api/admin/videos";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, youtubeId, category }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan video.");
        return;
      }
      router.push("/admin/video");
      router.refresh();
    } catch {
      setError("Gagal menyimpan video. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Judul Video
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Profil Sekolah SD Inovasi Ceria"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Kategori
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as VideoCategory)}
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
        <label htmlFor="youtubeId" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          URL atau ID Video YouTube
        </label>
        <input
          id="youtubeId"
          required
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          placeholder="https://youtu.be/xxxxxxxxxxx"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        <p className="mt-1 text-xs text-ink/70 dark:text-ink-dark/50">
          Tempel URL video YouTube (dari tombol Bagikan) atau ID video-nya saja. Video harus
          bersifat publik/tidak terdaftar (bukan privat) agar bisa tampil di website.
        </p>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Tambah Video"}
      </button>
    </form>
  );
}
