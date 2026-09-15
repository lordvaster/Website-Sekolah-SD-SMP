// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listPrograms } from "@/lib/repositories/programs";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminProgramsPage() {
  const programs = listPrograms();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Program & Kelas</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
            Kelola jenjang/kelas yang tampil di halaman Program & Kelas.
          </p>
        </div>
        <Link href="/admin/program/baru" className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Program
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/50 dark:border-white/10 dark:text-ink-dark/50">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Usia</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="px-5 py-3 font-semibold text-ink dark:text-ink-dark">{p.name}</td>
                <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">{p.ageRange}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/program/${p.id}`}
                      aria-label="Edit"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/programs/${p.id}`}
                      confirmMessage={`Hapus program "${p.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-ink/50 dark:text-ink-dark/50">
                  Belum ada program.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
