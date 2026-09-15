// Author: Zeday | https://join.co.id
import { listTeachers } from "@/lib/repositories/teachers";
import MediaThumb from "./MediaThumb";
import RevealOnScroll from "./RevealOnScroll";

export default function TeacherGrid() {
  const teachers = listTeachers();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {teachers.map((t, i) => (
        <RevealOnScroll key={t.slug} delay={(i % 4) * 0.06}>
          <div className="card overflow-hidden text-center">
            <div className="flex justify-center bg-primary/5 py-6 dark:bg-primary/10">
              <MediaThumb
                imagePath={t.photoPath}
                hue={t.hue}
                label={t.name}
                variant="avatar"
                className="h-24 w-24 rounded-full ring-4 ring-white dark:ring-surface-dark"
              />
            </div>
            <div className="p-4">
              <h3 className="font-heading font-bold text-ink dark:text-ink-dark">
                {t.name}
              </h3>
              <p className="text-sm font-semibold text-primary dark:text-primary-light">
                {t.role}
              </p>
              <p className="mt-1 text-xs text-ink/60 dark:text-ink-dark/60">
                {t.subject}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
