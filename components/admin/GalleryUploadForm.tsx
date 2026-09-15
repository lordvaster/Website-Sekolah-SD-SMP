// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import type { GalleryCategory } from "@/lib/repositories/gallery";

const categories: GalleryCategory[] = ["Kelas", "Acara", "Aktivitas"];

export default function GalleryUploadForm() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Kelas");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, category, imagePath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan foto.");
        return;
      }
      router.push("/admin/galeri");
      router.refresh();
    } catch {
      setError("Gagal menyimpan foto. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ImageUploadField
        label="Foto"
        folder="gallery"
        value={imagePath}
        onChange={setImagePath}
        placeholderLabel={caption || category}
        placeholderHue={205}
      />

      <div>
        <label htmlFor="caption" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Keterangan
        </label>
        <input
          id="caption"
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Contoh: Kegiatan Market Day kelas 3"
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
          onChange={(e) => setCategory(e.target.value as GalleryCategory)}
          className="mt-1 w-full max-w-xs rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        Simpan ke Galeri
      </button>
    </form>
  );
}
