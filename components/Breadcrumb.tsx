// Author: Zeday | https://join.co.id
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({
  items,
  homeLabel = "Beranda",
}: {
  items: { label: string; href?: string }[];
  homeLabel?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-primary/5 dark:border-white/10 dark:bg-primary/10">
      <ol className="container-page flex flex-wrap items-center gap-1 py-3 text-sm text-ink/70 dark:text-ink-dark/70">
        <li>
          <Link href="/" className="hover:text-primary dark:hover:text-primary-light">
            {homeLabel}
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="hover:text-primary dark:hover:text-primary-light">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink dark:text-ink-dark">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
