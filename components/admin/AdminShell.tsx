// Author: Zeday | https://join.co.id
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { AdminRole } from "@/lib/repositories/admin-users";

const links = [
  { href: "/admin/pengaturan", label: "Pengaturan" },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/guru", label: "Guru" },
  { href: "/admin/program", label: "Program" },
  { href: "/admin/prestasi", label: "Prestasi" },
  { href: "/admin/video", label: "Video" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/pendaftaran", label: "Pendaftaran" },
];

const ownerOnlyLinks = [
  { href: "/admin/pengguna", label: "Pengguna" },
  { href: "/admin/aktivitas", label: "Aktivitas" },
];

export default function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; role: AdminRole };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const visibleLinks = user.role === "owner" ? [...links, ...ownerOnlyLinks] : links;

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <header className="border-b border-black/5 bg-white dark:border-white/10 dark:bg-surface-dark">
        <div className="container-page flex h-16 items-center justify-between">
          <span className="font-heading font-bold text-primary dark:text-primary-light">
            Panel Admin
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink/60 dark:text-ink-dark/60 sm:inline">
              {user.name} · <span className="capitalize">{user.role}</span>
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-cta dark:text-ink-dark/60"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
        <nav aria-label="Navigasi admin" className="container-page">
          <ul className="flex flex-wrap gap-1 pb-3">
            {visibleLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "text-ink/70 hover:bg-primary/10 dark:text-ink-dark/70"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="container-page py-10">{children}</main>
    </div>
  );
}
