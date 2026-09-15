// Author: Zeday | https://join.co.id
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

// SQLite datetime('now') menyimpan waktu UTC tanpa penanda "Z" - tambahkan
// eksplisit di sini, kalau tidak Date akan salah mengiranya sebagai waktu
// lokal server dan bergeser sesuai zona waktu.
export function formatDateTime(sqliteUtcDateTime: string) {
  const iso = sqliteUtcDateTime.includes("T") ? sqliteUtcDateTime : `${sqliteUtcDateTime.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1 || /[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
