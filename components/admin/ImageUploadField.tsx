// Author: Zeday | https://join.co.id
"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";

type Props = {
  label: string;
  folder: "news" | "gallery" | "teachers" | "testimonials" | "achievements";
  value: string | null;
  onChange: (path: string | null) => void;
  placeholderLabel: string;
  placeholderHue: number;
  variant?: "photo" | "avatar";
};

export default function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  placeholderLabel,
  placeholderHue,
  variant = "photo",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal mengunggah gambar.");
        return;
      }
      onChange(data.path);
    } catch {
      setError("Gagal mengunggah gambar. Periksa koneksi anda.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const shapeClass =
    variant === "avatar" ? "h-28 w-28 rounded-full" : "aspect-video w-full max-w-xs rounded-xl2";

  return (
    <div>
      <span className="block text-sm font-semibold text-ink dark:text-ink-dark">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className={`relative overflow-hidden shadow-sm ${shapeClass}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <PlaceholderPhoto
              hue={placeholderHue}
              label={placeholderLabel}
              variant={variant}
              className="h-full w-full"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary text-sm disabled:opacity-70"
          >
            <ImagePlus className="h-4 w-4" /> {value ? "Ganti Gambar" : "Unggah Gambar"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-xs font-semibold text-ink/70 hover:text-cta dark:text-ink-dark/50"
            >
              <X className="h-3.5 w-3.5" /> Hapus gambar (pakai placeholder)
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onSelect}
        />
      </div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-cta">
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-ink/70 dark:text-ink-dark/50">
        JPG/PNG/WebP, maksimal 5MB. Jika tidak diisi, akan memakai gambar placeholder otomatis.
      </p>
    </div>
  );
}
