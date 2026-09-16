// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import type { Achievement } from "@/lib/repositories/achievements";

export default function AchievementForm({ initial }: { initial?: Achievement }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [year, setYear] = useState(initial?.year ?? String(new Date().getFullYear()));
  const [imagePath, setImagePath] = useState<string | null>(initial?.imagePath ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/achievements/${initial.id}` : "/api/admin/achievements";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, year, imagePath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan prestasi.");
        return;
      }
      router.push("/admin/prestasi");
      router.refresh();
    } catch {
      setError("Gagal menyimpan prestasi. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ImageUploadField
        label="Foto Sertifikat/Piala (opsional)"
        folder="achievements"
        value={imagePath}
        onChange={setImagePath}
        placeholderLabel={title || "Prestasi"}
        placeholderHue={initial?.hue ?? 205}
        variant="photo"
      />

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Judul Prestasi
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Juara 1 Lomba Sains Tingkat Kota"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Keterangan Singkat
          </label>
          <input
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Tim sains kelas 5, Kompetisi Sains Anak Palangkaraya"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Tahun
          </label>
          <input
            id="year"
            required
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className="mt-1 w-24 rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Tambah Prestasi"}
      </button>
    </form>
  );
}
