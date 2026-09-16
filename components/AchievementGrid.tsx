// Author: Zeday | https://join.co.id
import { Trophy } from "lucide-react";
import { listAchievements } from "@/lib/repositories/achievements";
import MediaThumb from "./MediaThumb";
import RevealOnScroll from "./RevealOnScroll";

export default function AchievementGrid() {
  const achievements = listAchievements();

  if (achievements.length === 0) {
    return (
      <p className="text-center text-ink/60 dark:text-ink-dark/60">
        Belum ada prestasi yang ditambahkan.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((a, i) => (
        <RevealOnScroll key={a.id} delay={(i % 3) * 0.08} className="min-w-0">
          <div className="card flex min-w-0 items-center gap-4 overflow-hidden p-4">
            <MediaThumb
              imagePath={a.imagePath}
              hue={a.hue}
              label={a.title}
              className="h-16 w-16 shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent-dark dark:text-accent-light">
                <Trophy className="h-3 w-3" aria-hidden="true" />
                {a.year}
              </span>
              <h3 className="mt-1 truncate font-heading font-bold text-ink dark:text-ink-dark">
                {a.title}
              </h3>
              <p className="text-sm text-ink/60 dark:text-ink-dark/60">{a.description}</p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
