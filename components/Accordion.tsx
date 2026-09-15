// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/5 rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 dark:divide-white/10 dark:bg-white/5 dark:ring-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading font-bold text-ink dark:text-ink-dark"
              >
                {item.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform dark:text-primary-light ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              hidden={!isOpen}
              className="px-5 pb-4 text-sm leading-relaxed text-ink/70 dark:text-ink-dark/70"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
