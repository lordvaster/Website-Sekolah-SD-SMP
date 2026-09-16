// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listVideos } from "@/lib/repositories/videos";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminVideosPage() {
  const videos = listVideos();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Video</h1>
          <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/60">
            Kelola video YouTube (profil sekolah, testimoni, virtual tour) yang tampil di
            halaman Galeri.
          </p>
        </div>
        <Link href="/admin/video/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Video
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <div key={v.id} className="card overflow-hidden">
            <div className="aspect-video bg-black/5 dark:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary dark:text-primary-light">
                  {v.category}
                </span>
                <p className="mt-1 truncate font-heading font-bold text-ink dark:text-ink-dark">
                  {v.title}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Link
                  href={`/admin/video/${v.id}`}
                  aria-label="Edit"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/videos/${v.id}`}
                  confirmMessage={`Hapus video "${v.title}"?`}
                />
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <p className="col-span-full py-8 text-center text-ink/70 dark:text-ink-dark/50">
            Belum ada video. Klik &ldquo;Tambah Video&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
