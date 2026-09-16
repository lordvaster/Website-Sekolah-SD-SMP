// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/repositories/testimonials";
import MediaThumb from "./MediaThumb";
import SectionHeading from "./SectionHeading";

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Kata Mereka" title="Apa Kata Orang Tua & Siswa" />
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="card flex flex-col items-center gap-4 p-8 text-center">
            <Quote className="h-8 w-8 text-accent" aria-hidden="true" />
            <p className="text-lg font-medium leading-relaxed text-ink dark:text-ink-dark">
              &ldquo;{t.quote}&rdquo;
            </p>
            <MediaThumb
              imagePath={t.photoPath}
              hue={t.hue}
              label={t.name}
              variant="avatar"
              className="h-14 w-14 rounded-full"
            />
            <div>
              <p className="font-heading font-bold text-ink dark:text-ink-dark">
                {t.name}
              </p>
              <p className="text-sm text-ink/60 dark:text-ink-dark/60">{t.role}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Testimoni sebelumnya"
              onClick={() =>
                setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 hover:bg-primary/5 dark:ring-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1">
              {testimonials.map((item, i) => (
                // Dot visualnya kecil (h-2.5 w-2.5), tapi area sentuh
                // tombolnya dilebarkan lewat padding supaya tetap memenuhi
                // ukuran target sentuh minimum yang direkomendasikan (~24px).
                <button
                  key={i}
                  aria-label={`Tampilkan testimoni ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="p-[7px]"
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      i === index ? "bg-primary" : "bg-primary/25"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Testimoni berikutnya"
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 hover:bg-primary/5 dark:ring-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
