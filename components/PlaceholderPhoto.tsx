// Author: Zeday | https://join.co.id
// Placeholder foto berbasis SVG (tanpa request eksternal) sehingga galeri &
// profil tetap ringan, cepat dimuat, dan bekerja saat offline (PWA).
import { initials } from "@/lib/utils";

type Props = {
  hue: number;
  label: string;
  variant?: "photo" | "avatar";
  className?: string;
};

export default function PlaceholderPhoto({
  hue,
  label,
  variant = "photo",
  className,
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

  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gradId})`} />
      <circle cx="330" cy="60" r="70" fill="white" opacity="0.12" />
      <circle cx="40" cy="260" r="90" fill="white" opacity="0.1" />
      <text
        x="20"
        y="270"
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
