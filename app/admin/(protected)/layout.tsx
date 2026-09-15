// Author: Zeday | https://join.co.id
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdminUser } from "@/lib/require-admin";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  // proxy.ts (Edge) sudah menjaga navigasi /admin/** lewat validitas token
  // sesi, tapi tidak bisa mengecek status aktif/peran pengguna ke database
  // (better-sqlite3 tidak tersedia di Edge Runtime) - pengecekan penuh di
  // sini adalah lapisan kedua, sekaligus sumber info nama/peran untuk nav.
  const user = await getCurrentAdminUser();
  if (!user) redirect("/admin");

  return <AdminShell user={{ name: user.name, role: user.role }}>{children}</AdminShell>;
}
