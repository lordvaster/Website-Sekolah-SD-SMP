// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type Program = {
  id: number;
  slug: string;
  name: string;
  ageRange: string;
  description: string;
  highlights: string[];
  hue: number;
};

type ProgramRow = {
  id: number;
  slug: string;
  name: string;
  age_range: string;
  description: string;
  highlights_json: string;
  hue: number;
};

function mapRow(row: ProgramRow): Program {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ageRange: row.age_range,
    description: row.description,
    highlights: JSON.parse(row.highlights_json),
    hue: row.hue,
  };
}

export function listPrograms(): Program[] {
  const rows = db
    .prepare("SELECT * FROM programs ORDER BY sort_order ASC, id ASC")
    .all() as ProgramRow[];
  return rows.map(mapRow);
}

export function getProgramById(id: number): Program | undefined {
  const row = db.prepare("SELECT * FROM programs WHERE id = ?").get(id) as
    | ProgramRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type ProgramInput = {
  slug: string;
  name: string;
  ageRange: string;
  description: string;
  highlights: string[];
  hue: number;
};

export function createProgram(input: ProgramInput): Program {
  const result = db
    .prepare(
      `INSERT INTO programs (slug, name, age_range, description, highlights_json, hue)
       VALUES (@slug, @name, @age_range, @description, @highlights_json, @hue)`
    )
    .run({
      slug: input.slug,
      name: input.name,
      age_range: input.ageRange,
      description: input.description,
      highlights_json: JSON.stringify(input.highlights),
      hue: input.hue,
    });
  return getProgramById(Number(result.lastInsertRowid))!;
}

export function updateProgram(id: number, input: ProgramInput): Program | undefined {
  db.prepare(
    `UPDATE programs SET
      slug = @slug, name = @name, age_range = @age_range, description = @description,
      highlights_json = @highlights_json, hue = @hue, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    slug: input.slug,
    name: input.name,
    age_range: input.ageRange,
    description: input.description,
    highlights_json: JSON.stringify(input.highlights),
    hue: input.hue,
  });
  return getProgramById(id);
}

export function deleteProgram(id: number): boolean {
  const result = db.prepare("DELETE FROM programs WHERE id = ?").run(id);
  return result.changes > 0;
}
