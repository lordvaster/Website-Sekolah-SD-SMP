// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { ActivityLogEntry } from "@/lib/repositories/activity-log";
import { formatDateTime } from "@/lib/utils";

const actionLabels: Record<string, string> = {
  login: "Masuk (login)",
  logout: "Keluar (logout)",
  "news.create": "Membuat berita",
  "news.update": "Mengubah berita",
  "news.delete": "Menghapus berita",
  "gallery.create": "Menambah foto galeri",
  "gallery.delete": "Menghapus foto galeri",
  "teacher.create": "Menambah profil guru",
  "teacher.update": "Mengubah profil guru",
  "teacher.delete": "Menghapus profil guru",
  "program.create": "Menambah program",
  "program.update": "Mengubah program",
  "program.delete": "Menghapus program",
  "registration.status": "Mengubah status pendaftaran",
  "settings.update": "Mengubah pengaturan situs",
  "2fa.enable": "Mengaktifkan 2FA",
  "2fa.disable": "Menonaktifkan 2FA",
  "user.create": "Menambah pengguna",
  "user.update": "Mengubah pengguna",
  "user.delete": "Menghapus pengguna",
  "user.reset_password": "Mereset password pengguna",
};

export default function ActivityLogView({
  initialEntries,
  initialHasMore,
}: {
  initialEntries: ActivityLogEntry[];
  initialHasMore: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    const last = entries[entries.length - 1];
    if (!last) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?beforeId=${last.id}`);
      const data = await res.json();
      setEntries((prev) => [...prev, ...data.entries]);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  if (entries.length === 0) {
    return <p className="text-center text-ink/60 dark:text-ink-dark/60">Belum ada aktivitas tercatat.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/50 dark:border-white/10 dark:text-ink-dark/50">
              <th className="px-5 py-3">Waktu</th>
              <th className="px-5 py-3">Pengguna</th>
              <th className="px-5 py-3">Aksi</th>
              <th className="px-5 py-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="whitespace-nowrap px-5 py-3 text-ink/70 dark:text-ink-dark/70">
                  {formatDateTime(entry.createdAt)}
                </td>
                <td className="px-5 py-3 font-semibold text-ink dark:text-ink-dark">{entry.username}</td>
                <td className="px-5 py-3 text-ink/80 dark:text-ink-dark/80">
                  {actionLabels[entry.action] ?? entry.action}
                </td>
                <td className="px-5 py-3 text-ink/60 dark:text-ink-dark/60">{entry.target ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button type="button" onClick={loadMore} disabled={loading} className="btn-secondary disabled:opacity-70">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}
