// Author: Zeday | https://join.co.id
// Menampilkan foto asli (diunggah admin) jika ada, atau placeholder SVG
// generatif sebagai fallback. Dipakai bersama oleh NewsCard, GalleryGrid,
// dan TeacherGrid supaya logika "foto atau placeholder" tidak diduplikasi.
import PlaceholderPhoto from "./PlaceholderPhoto";

type Props = {
  imagePath: string | null;
  hue: number;
  label: string;
  variant?: "photo" | "avatar";
  className?: string;
};

export default function MediaThumb({ imagePath, hue, label, variant = "photo", className }: Props) {
  if (imagePath) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imagePath} alt={label} className={`object-cover ${className ?? ""}`} />
    );
  }

  return <PlaceholderPhoto hue={hue} label={label} variant={variant} className={className} />;
}
