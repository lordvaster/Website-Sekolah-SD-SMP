// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus, Quote } from "lucide-react";
import { listTestimonials } from "@/lib/repositories/testimonials";
import MediaThumb from "@/components/MediaThumb";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminTestimonialsPage() {
  const testimonials = listTestimonials();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Testimoni</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
            Kelola testimoni orang tua dan siswa yang tampil di halaman Beranda.
          </p>
        </div>
        <Link href="/admin/testimoni/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Testimoni
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="card flex flex-col gap-3 p-4">
            <div className="flex items-center gap-4">
              <MediaThumb
                imagePath={t.photoPath}
                hue={t.hue}
                label={t.name}
                variant="avatar"
                className="h-14 w-14 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading font-bold text-ink dark:text-ink-dark">{t.name}</p>
                <p className="truncate text-sm text-primary dark:text-primary-light">{t.role}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Link
                  href={`/admin/testimoni/${t.id}`}
                  aria-label="Edit"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/testimonials/${t.id}`}
                  confirmMessage={`Hapus testimoni "${t.name}"?`}
                />
              </div>
            </div>
            <p className="flex items-start gap-2 text-sm text-ink/70 dark:text-ink-dark/70">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {t.quote}
            </p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="col-span-full py-8 text-center text-ink/50 dark:text-ink-dark/50">
            Belum ada testimoni. Klik &ldquo;Tambah Testimoni&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
