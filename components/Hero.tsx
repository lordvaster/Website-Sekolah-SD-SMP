// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PlaceholderPhoto from "./PlaceholderPhoto";

const slides = [
  { hue: 205, label: "Belajar sambil bermain" },
  { hue: 152, label: "Guru yang perhatian" },
  { hue: 28, label: "Fasilitas ramah anak" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-white to-white dark:from-primary/15 dark:via-surface-dark dark:to-surface-dark">
      <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-block animate-fade-in-up rounded-full bg-secondary/15 px-4 py-1 text-sm font-bold text-secondary-dark dark:text-secondary-light">
            Penerimaan Siswa Baru 2027/2028 Dibuka!
          </span>
          <h1 className="mt-4 animate-fade-in-up font-heading text-4xl font-extrabold leading-tight text-ink dark:text-ink-dark sm:text-5xl">
            Belajar Seru,{" "}
            <span className="text-primary dark:text-primary-light">Tumbuh</span>{" "}
            Percaya Diri
          </h1>
          <p className="mt-4 max-w-lg animate-fade-in-up text-lg leading-relaxed text-ink/70 dark:text-ink-dark/70">
            SD Inovasi Ceria menghadirkan pengalaman belajar yang menyenangkan
            untuk anak usia 6-12 tahun, didukung guru berpengalaman dan
            fasilitas yang aman serta nyaman.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/kontak" className="btn-primary">
              Daftar Sekarang
            </Link>
            <Link href="/kontak" className="btn-secondary">
              Hubungi Kami
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
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.label}
                aria-label={`Tampilkan slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
