// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import AchievementForm from "@/components/admin/AchievementForm";
import { getAchievementById } from "@/lib/repositories/achievements";

export const dynamic = "force-dynamic";

export default async function AdminEditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievement = getAchievementById(Number(id));
  if (!achievement) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Edit Prestasi
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <AchievementForm initial={achievement} />
      </div>
    </div>
  );
}
