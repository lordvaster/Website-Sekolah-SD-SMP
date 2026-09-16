// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import type { Testimonial } from "@/lib/repositories/testimonials";

export default function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [photoPath, setPhotoPath] = useState<string | null>(initial?.photoPath ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/testimonials/${initial.id}` : "/api/admin/testimonials";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, quote, photoPath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan testimoni.");
        return;
      }
      router.push("/admin/testimoni");
      router.refresh();
    } catch {
      setError("Gagal menyimpan testimoni. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ImageUploadField
        label="Foto (opsional)"
        folder="testimonials"
        value={photoPath}
        onChange={setPhotoPath}
        placeholderLabel={name || "Testimoni"}
        placeholderHue={initial?.hue ?? 205}
        variant="avatar"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nama
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Ibu Ratna, Wali Murid Kelas 2"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Peran
        </label>
        <input
          id="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Contoh: Orang Tua Siswa"
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div>
        <label htmlFor="quote" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Kutipan Testimoni
        </label>
        <textarea
          id="quote"
          required
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Tambah Testimoni"}
      </button>
    </form>
  );
}
