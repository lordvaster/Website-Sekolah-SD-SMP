// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { navLinks, siteConfig } from "@/lib/site-config";

export default function Footer({ tagline }: { tagline?: string }) {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white dark:border-white/10 dark:bg-surface-dark">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo tagline={tagline} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70 dark:text-ink-dark/70">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram SD Inovasi Ceria"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook SD Inovasi Ceria"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube SD Inovasi Ceria"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60 dark:text-ink-dark/60">
            Navigasi
          </h2>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink/80 hover:text-primary dark:text-ink-dark/80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60 dark:text-ink-dark/60">
            Kontak
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/80 dark:text-ink-dark/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}>
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-6 dark:border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink/60 dark:text-ink-dark/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi. ·{" "}
            <Link href="/kebijakan-privasi" className="hover:text-primary hover:underline dark:hover:text-primary-light">
              Kebijakan Privasi
            </Link>
          </p>
          {siteConfig.developer.showCredit && (
            <p>
              Dikembangkan oleh{" "}
              <a
                href={siteConfig.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline dark:text-primary-light"
              >
                {siteConfig.developer.name}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
