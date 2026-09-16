// Author: Zeday | https://join.co.id
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/require-admin";
import { listActivity } from "@/lib/repositories/activity-log";
import ActivityLogView from "@/components/admin/ActivityLogView";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) redirect("/admin");
  if (currentUser.role !== "owner") redirect("/admin/pengaturan");

  const { entries, hasMore } = listActivity();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Aktivitas</h1>
      <p className="mt-1 text-sm text-ink/70 dark:text-ink-dark/60">
        Riwayat siapa mengubah apa di panel admin - login, konten, pengaturan, dan pengguna.
      </p>
      <div className="mt-8">
        <ActivityLogView initialEntries={entries} initialHasMore={hasMore} />
      </div>
    </div>
  );
}
