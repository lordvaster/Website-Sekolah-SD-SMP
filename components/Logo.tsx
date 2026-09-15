// Author: Zeday | https://join.co.id
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="32" cy="32" r="32" fill="#4A90E2" />
        <path
          d="M32 14l14 7-14 7-14-7z"
          fill="#FFB84D"
        />
        <path
          d="M18 24v8c0 5 6 9 14 9s14-4 14-9v-8"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-heading text-lg font-bold leading-tight text-primary dark:text-primary-light">
        {siteConfig.shortName}
        <span className="block text-[11px] font-medium text-ink/60 dark:text-ink-dark/60">
          {siteConfig.tagline}
        </span>
      </span>
    </Link>
  );
}
