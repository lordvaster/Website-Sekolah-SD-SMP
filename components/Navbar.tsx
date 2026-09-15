// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-surface-dark/90">
      <nav
        aria-label="Navigasi utama"
        className="container-page flex h-20 items-center justify-between"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-[15px] font-semibold transition-colors",
                    active
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                      : "text-ink/80 hover:bg-primary/5 hover:text-primary dark:text-ink-dark/80 dark:hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/kontak" className="btn-primary hidden sm:inline-flex">
            Daftar Sekarang
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 dark:ring-white/20 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-black/5 bg-white px-4 pb-6 pt-2 dark:border-white/10 dark:bg-surface-dark lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-primary/5 dark:text-ink-dark dark:hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/kontak"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Daftar Sekarang
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
