// Author: Zeday | https://join.co.id
// Placeholder foto berbasis SVG (tanpa request eksternal) sehingga galeri &
// profil tetap ringan, cepat dimuat, dan bekerja saat offline (PWA).
import { initials } from "@/lib/utils";

type Props = {
  hue: number;
  label: string;
  variant?: "photo" | "avatar";
  className?: string;
  // Rasio lebar/tinggi kotak pembungkus (mis. galeri masonry memakai kartu
  // dengan tinggi bervariasi). viewBox disesuaikan ke rasio ini alih-alih
  // memakai preserveAspectRatio="...slice" pada viewBox tetap 4:3 - cara
  // lama itu memotong sisi kiri/kanan atau atas/bawah gambar tergantung
  // rasio target, sehingga label teks (diposisikan tetap di viewBox asli)
  // bisa ikut terpotong/hilang dari tampilan.
  aspectRatio?: number;
};

export default function PlaceholderPhoto({
  hue,
  label,
  variant = "photo",
  className,
  aspectRatio = 4 / 3,
}: Props) {
  const c1 = `hsl(${hue}, 78%, 62%)`;
  const c2 = `hsl(${(hue + 40) % 360}, 78%, 48%)`;
  const gradId = `g-${hue}-${variant}`;

  if (variant === "avatar") {
    return (
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={label}
        className={className}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fill="white"
          fontFamily="sans-serif"
        >
          {initials(label)}
        </text>
      </svg>
    );
  }

  const vbW = 400;
  const vbH = Math.round(vbW / aspectRatio);

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width={vbW} height={vbH} fill={`url(#${gradId})`} />
      <circle cx={vbW * 0.825} cy={vbH * 0.2} r={vbH * 0.35} fill="white" opacity="0.12" />
      <circle cx={vbW * 0.1} cy={vbH * 0.87} r={vbH * 0.45} fill="white" opacity="0.1" />
      <text
        x="20"
        y={vbH - 30}
        fontSize="20"
        fontWeight="700"
        fill="white"
        fontFamily="sans-serif"
        opacity="0.95"
      >
        {label}
      </text>
    </svg>
  );
}
