// Author: Zeday | https://join.co.id
import { readSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import TwoFactorSettings from "@/components/admin/TwoFactorSettings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await readSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
          Pengaturan Situs
        </h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Favicon dan tagline yang tampil di seluruh halaman publik.
        </p>
        <div className="mt-8 card p-6 sm:p-8">
          <SettingsForm initial={settings} />
        </div>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
          Keamanan
        </h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          Lindungi akses ke panel admin ini.
        </p>
        <div className="mt-8 card p-6 sm:p-8">
          <TwoFactorSettings />
        </div>
      </div>
    </div>
  );
}
