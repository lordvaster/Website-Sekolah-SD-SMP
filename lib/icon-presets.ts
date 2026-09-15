// Author: Zeday | https://join.co.id
// Preset favicon/app-icon yang bisa dipilih lewat halaman admin (/admin/pengaturan).
// Setiap preset adalah SVG inline sehingga tidak butuh file gambar terpisah,
// membuat favicon ringan dan cepat dimuat.

export type IconPresetKey =
  | "star"
  | "book"
  | "rocket"
  | "rainbow"
  | "apple";

export const iconPresets: Record<
  IconPresetKey,
  { label: string; bg: string; svgPath: string }
> = {
  star: {
    label: "Bintang Ceria",
    bg: "#4A90E2",
    svgPath:
      "M32 6l7.9 16.5 18.1 2.4-13.3 12.7 3.4 18-16.1-9-16.1 9 3.4-18L6 24.9l18.1-2.4z",
  },
  book: {
    label: "Buku Pintar",
    bg: "#3DBE85",
    svgPath:
      "M8 12c8-4 20-4 24 0v40c-4-4-16-4-24 0zM56 12c-8-4-20-4-24 0v40c4-4 16-4 24 0z",
  },
  rocket: {
    label: "Roket Semangat",
    bg: "#FFB84D",
    svgPath:
      "M32 4c8 6 12 16 12 28 0 6-2 12-4 16l-8 8-8-8c-2-4-4-10-4-16 0-12 4-22 12-28zM24 44l-8 8 4 4 8-8zM40 44l8 8-4 4-8-8z",
  },
  rainbow: {
    label: "Pelangi",
    bg: "#FF6B6B",
    svgPath:
      "M4 52a28 28 0 0 1 56 0h-8a20 20 0 0 0-40 0zm8 0a20 20 0 0 1 40 0h-8a12 12 0 0 0-24 0z",
  },
  apple: {
    label: "Apel Segar",
    bg: "#E24C4C",
    svgPath:
      "M33 10c1-4 5-6 9-6-1 4-4 7-8 7zM32 18c9 0 16 8 16 19 0 12-8 22-16 22s-16-10-16-22c0-11 7-19 16-19z",
  },
};

export const defaultIcon: IconPresetKey = "star";
