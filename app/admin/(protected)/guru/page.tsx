// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listTeachers } from "@/lib/repositories/teachers";
import MediaThumb from "@/components/MediaThumb";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminTeachersPage() {
  const teachers = listTeachers();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Guru</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
            Kelola profil tenaga pengajar yang tampil di halaman Tentang Sekolah.
          </p>
        </div>
        <Link href="/admin/guru/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Guru
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => (
          <div key={t.id} className="card flex items-center gap-4 p-4">
            <MediaThumb
              imagePath={t.photoPath}
              hue={t.hue}
              label={t.name}
              variant="avatar"
              className="h-16 w-16 shrink-0 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading font-bold text-ink dark:text-ink-dark">{t.name}</p>
              <p className="truncate text-sm text-primary dark:text-primary-light">{t.role}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/admin/guru/${t.id}`}
                aria-label="Edit"
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteButton
                endpoint={`/api/admin/teachers/${t.id}`}
                confirmMessage={`Hapus profil "${t.name}"?`}
              />
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <p className="col-span-full py-8 text-center text-ink/50 dark:text-ink-dark/50">
            Belum ada profil guru. Klik &ldquo;Tambah Guru&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
