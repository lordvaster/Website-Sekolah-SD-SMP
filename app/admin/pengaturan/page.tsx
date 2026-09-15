// Author: Zeday | https://join.co.id
import { readSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await readSettings();

  return (
    <div className="container-page max-w-2xl py-14">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Pengaturan Situs
      </h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
        Halaman ini hanya dapat diakses oleh admin sekolah.
      </p>
      <div className="mt-8 card p-6 sm:p-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
