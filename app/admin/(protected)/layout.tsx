// Author: Zeday | https://join.co.id
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
