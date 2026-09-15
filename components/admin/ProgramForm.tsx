// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import type { Program } from "@/lib/repositories/programs";

export default function ProgramForm({ initial }: { initial?: Program }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [ageRange, setAgeRange] = useState(initial?.ageRange ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [highlights, setHighlights] = useState(initial?.highlights.join("\n") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/programs/${initial.id}` : "/api/admin/programs";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ageRange, description, highlights }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan program.");
        return;
      }
      router.push("/admin/program");
      router.refresh();
    } catch {
      setError("Gagal menyimpan program. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Nama Program/Kelas
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kelas 3"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
        <div>
          <label htmlFor="ageRange" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Rentang Usia
          </label>
          <input
            id="ageRange"
            required
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            placeholder="Contoh: 8-9 tahun"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Deskripsi
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div>
        <label htmlFor="highlights" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Poin Unggulan
        </label>
        <textarea
          id="highlights"
          required
          rows={4}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">Satu poin per baris.</p>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Tambah Program"}
      </button>
    </form>
  );
}
