// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Plus } from "lucide-react";
import { listGalleryItems } from "@/lib/repositories/gallery";
import MediaThumb from "@/components/MediaThumb";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  const items = listGalleryItems();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Galeri</h1>
          <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/60">
            Kelola foto kegiatan yang tampil di halaman Galeri.
          </p>
        </div>
        <Link href="/admin/galeri/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Foto
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <div className="aspect-video">
              <MediaThumb
                imagePath={item.imagePath}
                hue={item.hue}
                label={item.caption}
                className="h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink dark:text-ink-dark">
                  {item.caption}
                </p>
                <p className="text-xs text-ink/70 dark:text-ink-dark/50">{item.category}</p>
              </div>
              <DeleteButton
                endpoint={`/api/admin/gallery/${item.id}`}
                confirmMessage={`Hapus foto "${item.caption}"?`}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full py-8 text-center text-ink/70 dark:text-ink-dark/50">
            Belum ada foto. Klik &ldquo;Tambah Foto&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
