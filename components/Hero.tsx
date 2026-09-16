// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderPhoto from "./PlaceholderPhoto";
import { useTranslation } from "@/lib/i18n/LocaleContext";

const slides = [
  { hue: 205, label: "Belajar sambil bermain" },
  { hue: 152, label: "Guru yang perhatian" },
  { hue: 28, label: "Fasilitas ramah anak" },
];

export default function Hero({ tagline }: { tagline: string }) {
  const [index, setIndex] = useState(0);
  const { dict } = useTranslation();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-white to-white dark:from-primary/15 dark:via-surface-dark dark:to-surface-dark">
      <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-block animate-fade-in-up rounded-full bg-secondary/15 px-4 py-1 text-sm font-bold text-secondary-dark dark:text-secondary-light">
            {dict.hero.badge}
          </span>
          <h1 className="mt-4 animate-fade-in-up font-heading text-4xl font-extrabold leading-tight text-ink dark:text-ink-dark sm:text-5xl">
            {tagline}
          </h1>
          <p className="mt-4 max-w-lg animate-fade-in-up text-lg leading-relaxed text-ink/70 dark:text-ink-dark/70">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/kontak" className="btn-primary">
              {dict.hero.ctaRegister}
            </Link>
            <Link href="/kontak" className="btn-secondary">
              {dict.hero.ctaContact}
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <PlaceholderPhoto
                hue={slides[index].hue}
                label={slides[index].label}
                className="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((s, i) => (
              // Dot visualnya kecil (h-2.5), tapi area sentuh tombolnya
              // dilebarkan lewat padding (p-[7px]) supaya tetap memenuhi
              // ukuran target sentuh minimum yang direkomendasikan (~24px).
              <button
                key={s.label}
                aria-label={`Tampilkan slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="p-[7px]"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2.5 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
