// Author: Zeday | https://join.co.id
import { listRegistrations } from "@/lib/repositories/registrations";
import { formatDate } from "@/lib/utils";
import RegistrationStatusSelect from "@/components/admin/RegistrationStatusSelect";

export const dynamic = "force-dynamic";

export default function AdminRegistrationsPage() {
  const registrations = listRegistrations();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Pendaftaran</h1>
      <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/60">
        Daftar calon siswa yang mengisi formulir pendaftaran di halaman Kontak.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/70 dark:border-white/10 dark:text-ink-dark/50">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Nama Anak</th>
              <th className="px-5 py-3">Jenjang</th>
              <th className="px-5 py-3">Orang Tua</th>
              <th className="px-5 py-3">Kontak</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} className="border-b border-black/5 align-top last:border-0 dark:border-white/10">
                <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">
                  {formatDate(r.createdAt.slice(0, 10))}
                </td>
                <td className="px-5 py-3 font-semibold text-ink dark:text-ink-dark">
                  {r.childName}
                  <span className="block text-xs font-normal text-ink/70 dark:text-ink-dark/50">
                    {r.childAge} tahun
                  </span>
                </td>
                <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">{r.program}</td>
                <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">{r.parentName}</td>
                <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">
                  <a href={`mailto:${r.email}`} className="block hover:text-primary">
                    {r.email}
                  </a>
                  <a href={`tel:${r.phone}`} className="block hover:text-primary">
                    {r.phone}
                  </a>
                </td>
                <td className="px-5 py-3">
                  <RegistrationStatusSelect id={r.id} status={r.status} />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink/70 dark:text-ink-dark/50">
                  Belum ada pendaftaran masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
