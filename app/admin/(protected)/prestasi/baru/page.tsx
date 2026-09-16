// Author: Zeday | https://join.co.id
import AchievementForm from "@/components/admin/AchievementForm";

export default function AdminNewAchievementPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tambah Prestasi
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <AchievementForm />
      </div>
    </div>
  );
}
