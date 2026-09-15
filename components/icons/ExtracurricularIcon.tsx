// Author: Zeday | https://join.co.id
import { BookOpen, Music, PaintBucket, Trophy, Waves, Code2, type LucideIcon } from "lucide-react";
import type { Extracurricular } from "@/lib/data";

const iconMap: Record<Extracurricular["icon"], LucideIcon> = {
  ball: Trophy,
  paint: PaintBucket,
  music: Music,
  code: Code2,
  book: BookOpen,
  swim: Waves,
};

export default function ExtracurricularIcon({
  icon,
  className,
}: {
  icon: Extracurricular["icon"];
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon className={className} aria-hidden="true" />;
}
