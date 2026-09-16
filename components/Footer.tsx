// Author: Zeday | https://join.co.id
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { getNavLinks, siteConfig } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/settings";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type FooterInfo = Pick<
  SiteSettings,
  "schoolDescription" | "schoolAddress" | "schoolPhone" | "schoolEmail" | "socialInstagram" | "socialFacebook" | "socialYoutube"
>;

export default function Footer({
  tagline,
  info,
  dict,
}: {
  tagline?: string;
  info: FooterInfo;
  dict: Dictionary;
}) {
  const links = getNavLinks(dict);

  return (
    <footer className="mt-20 border-t border-black/5 bg-white dark:border-white/10 dark:bg-surface-dark">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo tagline={tagline} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70 dark:text-ink-dark/70">
            {info.schoolDescription}
          </p>
          <div className="mt-4 flex gap-3">
            {info.socialInstagram && (
              <a
                href={info.socialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${siteConfig.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {info.socialFacebook && (
              <a
                href={info.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook ${siteConfig.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {info.socialYoutube && (
              <a
                href={info.socialYoutube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`YouTube ${siteConfig.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light"
              >
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink/60 dark:text-ink-dark/60">
            {dict.footer.navigation}
          </h2>
          <ul className="mt-4 space-y-2">
            {links.map((link) => (
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
            {dict.footer.contact}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/80 dark:text-ink-dark/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{info.schoolAddress}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${info.schoolPhone.replace(/[^\d+]/g, "")}`}>
                {info.schoolPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${info.schoolEmail}`}>{info.schoolEmail}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-6 dark:border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink/60 dark:text-ink-dark/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.allRightsReserved} ·{" "}
            <Link href="/kebijakan-privasi" className="hover:text-primary hover:underline dark:hover:text-primary-light">
              {dict.footer.privacyPolicy}
            </Link>
          </p>
          {siteConfig.developer.showCredit && (
            <p>
              {dict.footer.developedBy}{" "}
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
