// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listFaqs } from "@/lib/repositories/faqs";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminFaqsPage() {
  const faqs = listFaqs();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">FAQ</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
            Kelola pertanyaan yang sering diajukan orang tua di halaman Kontak & Pendaftaran.
          </p>
        </div>
        <Link href="/admin/faq/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah FAQ
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="card flex items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-ink dark:text-ink-dark">{f.question}</p>
              <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/70">{f.answer}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/admin/faq/${f.id}`}
                aria-label="Edit"
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteButton
                endpoint={`/api/admin/faqs/${f.id}`}
                confirmMessage={`Hapus FAQ "${f.question}"?`}
              />
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="py-8 text-center text-ink/50 dark:text-ink-dark/50">
            Belum ada FAQ. Klik &ldquo;Tambah FAQ&rdquo; untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
