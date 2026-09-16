// Author: Zeday | https://join.co.id
"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/lib/repositories/gallery";
import MediaThumb from "./MediaThumb";

const categories: (GalleryCategory | "Semua")[] = ["Semua", "Kelas", "Acara", "Aktivitas"];

// Rasio tinggi yang divariasikan per foto (dipilih berdasarkan id, jadi
// konsisten antar render) supaya susunan kolom terlihat seperti masonry
// asli (tinggi kartu tidak seragam) - baik untuk foto asli yang diunggah
// admin maupun placeholder generatif sebelum ada foto asli. `ratio` dipakai
// PlaceholderPhoto untuk menyesuaikan viewBox-nya sendiri (bukan crop),
// supaya label teksnya tidak ikut terpotong di rasio non-4:3.
const aspectVariants = [
  { className: "aspect-[3/4]", ratio: 3 / 4 },
  { className: "aspect-square", ratio: 1 },
  { className: "aspect-[4/3]", ratio: 4 / 3 },
  { className: "aspect-[4/5]", ratio: 4 / 5 },
  { className: "aspect-video", ratio: 16 / 9 },
];

// Modulo id biasa gampang "beresonansi" dengan jumlah kolom (mis. 20 foto /
// 4 kolom / 5 varian rasio bisa pas siklus penuh per kolom, jadi tiap
// kolom kebetulan sinkron dan susunan terlihat seperti baris rapi, bukan
// masonry acak). Hash perkalian sederhana ini memutus pola periodik itu.
function pickAspectVariant(id: number) {
  const hashed = Math.imul(id, 2654435761) >>> 0;
  return aspectVariants[hashed % aspectVariants.length];
}

export default function GalleryGrid({ items: galleryItems }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("Semua");
  const [activeId, setActiveId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "Semua"
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [galleryItems, filter]
  );

  const activeIndex = filtered.findIndex((item) => item.id === activeId);
  const active = activeIndex >= 0 ? filtered[activeIndex] : null;

  const goTo = (delta: number) => {
    if (activeIndex < 0) return;
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveId(filtered[next].id);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter kategori galeri">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filter === cat
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20 dark:text-primary-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-ink/70 dark:text-ink-dark/60">
          {galleryItems.length === 0
            ? "Belum ada foto di galeri."
            : "Tidak ada foto pada kategori ini."}
        </p>
      ) : (
        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:_balance]">
          {filtered.map((item) => {
            const variant = pickAspectVariant(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className="mb-4 block w-full overflow-hidden rounded-xl2 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:shadow-md dark:ring-white/10"
              >
                <MediaThumb
                  imagePath={item.imagePath}
                  hue={item.hue}
                  label={item.caption}
                  className={`w-full ${variant.className}`}
                  aspectRatio={variant.ratio}
                />
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveId(null)}
        >
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setActiveId(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              goTo(-1);
            }}
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl2"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaThumb imagePath={active.imagePath} hue={active.hue} label={active.caption} className="w-full" />
            <p className="bg-white p-4 text-center font-semibold text-ink dark:bg-surface-dark dark:text-ink-dark">
              {active.caption}
            </p>
          </div>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              goTo(1);
            }}
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}
