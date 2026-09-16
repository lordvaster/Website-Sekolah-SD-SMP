// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type Achievement = {
  id: number;
  title: string;
  description: string;
  year: string;
  hue: number;
  imagePath: string | null;
};

type AchievementRow = {
  id: number;
  title: string;
  description: string;
  year: string;
  hue: number;
  image_path: string | null;
};

function mapRow(row: AchievementRow): Achievement {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    year: row.year,
    hue: row.hue,
    imagePath: row.image_path,
  };
}

export function listAchievements(): Achievement[] {
  const rows = db
    .prepare("SELECT * FROM achievements ORDER BY sort_order ASC, id ASC")
    .all() as AchievementRow[];
  return rows.map(mapRow);
}

export function getAchievementById(id: number): Achievement | undefined {
  const row = db.prepare("SELECT * FROM achievements WHERE id = ?").get(id) as
    | AchievementRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type AchievementInput = {
  title: string;
  description: string;
  year: string;
  hue: number;
  imagePath?: string | null;
};

export function createAchievement(input: AchievementInput): Achievement {
  const result = db
    .prepare(
      `INSERT INTO achievements (title, description, year, hue, image_path)
       VALUES (@title, @description, @year, @hue, @image_path)`
    )
    .run({
      title: input.title,
      description: input.description,
      year: input.year,
      hue: input.hue,
      image_path: input.imagePath ?? null,
    });
  return getAchievementById(Number(result.lastInsertRowid))!;
}

export function updateAchievement(id: number, input: AchievementInput): Achievement | undefined {
  db.prepare(
    `UPDATE achievements SET
      title = @title, description = @description, year = @year, hue = @hue,
      image_path = @image_path, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    title: input.title,
    description: input.description,
    year: input.year,
    hue: input.hue,
    image_path: input.imagePath ?? null,
  });
  return getAchievementById(id);
}

export function deleteAchievement(id: number): boolean {
  const result = db.prepare("DELETE FROM achievements WHERE id = ?").run(id);
  return result.changes > 0;
}
