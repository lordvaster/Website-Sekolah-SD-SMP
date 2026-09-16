// Author: Zeday | https://join.co.id
"use client";

import { useTranslation } from "@/lib/i18n/LocaleContext";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function HowToRegister() {
  const { dict } = useTranslation();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.howToRegister.eyebrow}
          title={dict.howToRegister.title}
          description={dict.howToRegister.description}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.howToRegister.steps.map((step, i) => (
            <RevealOnScroll key={step.title} delay={i * 0.08}>
              <div className="card relative h-full p-6 pt-10 text-center">
                <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary font-heading text-lg font-extrabold text-white shadow-md">
                  {i + 1}
                </span>
                <h3 className="font-heading font-bold text-ink dark:text-ink-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">{step.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
