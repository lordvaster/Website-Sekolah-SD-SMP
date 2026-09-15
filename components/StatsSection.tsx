// Author: Zeday | https://join.co.id
import { stats } from "@/lib/data";
import RevealOnScroll from "./RevealOnScroll";

export default function StatsSection() {
  return (
    <section className="border-y border-black/5 bg-primary/5 py-12 dark:border-white/10 dark:bg-primary/10">
      <div className="container-page grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <RevealOnScroll key={stat.label} delay={i * 0.08} className="text-center">
            <p className="font-heading text-3xl font-extrabold text-primary dark:text-primary-light sm:text-4xl">
              {stat.value}+
            </p>
            <p className="mt-1 text-sm font-semibold text-ink/70 dark:text-ink-dark/70">
              {stat.label}
            </p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
