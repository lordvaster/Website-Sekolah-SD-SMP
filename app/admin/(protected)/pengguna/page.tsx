// Author: Zeday | https://join.co.id
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/require-admin";
import { listAdminUsers, toSummary } from "@/lib/repositories/admin-users";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) redirect("/admin");
  // AdminShell (layout) sudah menyembunyikan link menu ini dari non-owner,
  // tapi navigasi langsung ke URL-nya tetap harus ditolak di sini juga.
  if (currentUser.role !== "owner") redirect("/admin/pengaturan");

  const users = listAdminUsers().map(toSummary);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Pengguna</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
        Kelola akun individual staf yang bisa masuk ke panel admin ini.
      </p>
      <div className="mt-8 card p-6 sm:p-8">
        <UsersManager users={users} currentUserId={currentUser.id} />
      </div>
    </div>
  );
}
