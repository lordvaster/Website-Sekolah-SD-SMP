// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listAchievements } from "@/lib/repositories/achievements";
import MediaThumb from "@/components/MediaThumb";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminAchievementsPage() {
  const achievements = listAchievements();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Prestasi</h1>
          <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/60">
            Kelola daftar prestasi siswa yang tampil di halaman Tentang Sekolah.
          </p>
        </div>
        <Link href="/admin/prestasi/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Prestasi
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <div key={a.id} className="card flex items-center gap-4 p-4">
            <MediaThumb
              imagePath={a.imagePath}
              hue={a.hue}
              label={a.title}
              className="h-16 w-16 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading font-bold text-ink dark:text-ink-dark">{a.title}</p>
              <p className="truncate text-sm text-primary dark:text-primary-light">{a.year}</p>
              <p className="truncate text-xs text-ink/70 dark:text-ink-dark/60">{a.description}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/admin/prestasi/${a.id}`}
                aria-label="Edit"
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteButton
                endpoint={`/api/admin/achievements/${a.id}`}
                confirmMessage={`Hapus prestasi "${a.title}"?`}
              />
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <p className="col-span-full py-8 text-center text-ink/70 dark:text-ink-dark/50">
            Belum ada prestasi. Klik &ldquo;Tambah Prestasi&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
