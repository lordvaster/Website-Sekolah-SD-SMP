// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import type { Teacher } from "@/lib/repositories/teachers";

export default function TeacherForm({ initial }: { initial?: Teacher }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [photoPath, setPhotoPath] = useState<string | null>(initial?.photoPath ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const endpoint = initial ? `/api/admin/teachers/${initial.id}` : "/api/admin/teachers";
    const method = initial ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, subject, bio, photoPath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan profil guru.");
        return;
      }
      router.push("/admin/guru");
      router.refresh();
    } catch {
      setError("Gagal menyimpan profil guru. Periksa koneksi anda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ImageUploadField
        label="Foto Profil"
        folder="teachers"
        value={photoPath}
        onChange={setPhotoPath}
        placeholderLabel={name || "Guru"}
        placeholderHue={initial?.hue ?? 205}
        variant="avatar"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nama Lengkap
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Jabatan
          </label>
          <input
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Contoh: Wali Kelas 3"
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Bidang / Mata Pelajaran
          </label>
          <input
            id="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Bio Singkat
        </label>
        <textarea
          id="bio"
          required
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
        {initial ? "Simpan Perubahan" : "Tambah Guru"}
      </button>
    </form>
  );
}
