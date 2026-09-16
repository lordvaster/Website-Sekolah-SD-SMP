// Author: Zeday | https://join.co.id
"use client";

import { BookOpen, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "@/lib/i18n/LocaleContext";

const icons = [BookOpen, ShieldCheck, Users, Sparkles, HeartHandshake];

export default function FeatureCards() {
  const { dict } = useTranslation();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.features.eyebrow}
          title={dict.features.title}
          description={dict.features.description}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.features.items.map((f, i) => {
            const Icon = icons[i];
            return (
              <RevealOnScroll key={f.title} delay={i * 0.07}>
                <div className="card h-full p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-ink dark:text-ink-dark">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-ink-dark/70">
                    {f.desc}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
