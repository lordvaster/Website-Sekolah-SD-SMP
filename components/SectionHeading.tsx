// Author: Zeday | https://join.co.id
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-accent/15 px-4 py-1 text-sm font-bold text-accent-dark dark:text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-heading text-3xl font-extrabold text-ink dark:text-ink-dark sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-ink/70 dark:text-ink-dark/70">
          {description}
        </p>
      )}
    </div>
  );
}
