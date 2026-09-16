// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LocaleContext";

function getRemaining(deadline: string) {
  // Batas akhir dianggap sampai penghujung hari itu (23:59:59 waktu lokal
  // pengunjung), bukan tengah malam di awal harinya - supaya tanggal yang
  // dipilih admin masih terhitung "belum lewat" sepanjang hari itu.
  const target = new Date(`${deadline}T23:59:59`).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ deadline }: { deadline: string }) {
  const { dict } = useTranslation();
  // Mulai dari null (bukan menghitung langsung) supaya render pertama di
  // server dan di client sama-sama kosong - waktu server saat render dan
  // waktu client saat hydration pasti sedikit berbeda, jadi menghitung
  // sisa waktu langsung di render pertama berisiko hydration mismatch.
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining>>(null);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(deadline));
    // setTimeout(tick, 0) alih-alih memanggil tick() langsung di sini -
    // linter react-hooks melarang setState sinkron langsung di badan efek
    // (bisa memicu cascading render); menundanya lewat macrotask tetap
    // tampil hampir instan (dalam hitungan milidetik) tanpa melanggar itu.
    const timeoutId = setTimeout(tick, 0);
    const intervalId = setInterval(tick, 1000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [deadline]);

  if (!remaining) return null;

  const units: { value: number; label: string }[] = [
    { value: remaining.days, label: dict.countdown.days },
    { value: remaining.hours, label: dict.countdown.hours },
    { value: remaining.minutes, label: dict.countdown.minutes },
    { value: remaining.seconds, label: dict.countdown.seconds },
  ];

  return (
    <div className="mx-auto mt-6 max-w-md">
      <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
        {dict.countdown.label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl2 bg-white/15 py-3 text-center backdrop-blur-sm"
          >
            <p className="font-heading text-2xl font-extrabold tabular-nums sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
