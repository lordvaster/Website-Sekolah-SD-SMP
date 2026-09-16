// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  hue: number;
  photoPath: string | null;
};

type TestimonialRow = {
  id: number;
  name: string;
  role: string;
  quote: string;
  hue: number;
  photo_path: string | null;
};

function mapRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    quote: row.quote,
    hue: row.hue,
    photoPath: row.photo_path,
  };
}

export function listTestimonials(): Testimonial[] {
  const rows = db
    .prepare("SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC")
    .all() as TestimonialRow[];
  return rows.map(mapRow);
}

export function getTestimonialById(id: number): Testimonial | undefined {
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id) as
    | TestimonialRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type TestimonialInput = {
  name: string;
  role: string;
  quote: string;
  hue: number;
  photoPath?: string | null;
};

export function createTestimonial(input: TestimonialInput): Testimonial {
  const result = db
    .prepare(
      `INSERT INTO testimonials (name, role, quote, hue, photo_path)
       VALUES (@name, @role, @quote, @hue, @photo_path)`
    )
    .run({
      name: input.name,
      role: input.role,
      quote: input.quote,
      hue: input.hue,
      photo_path: input.photoPath ?? null,
    });
  return getTestimonialById(Number(result.lastInsertRowid))!;
}

export function updateTestimonial(id: number, input: TestimonialInput): Testimonial | undefined {
  db.prepare(
    `UPDATE testimonials SET
      name = @name, role = @role, quote = @quote, hue = @hue,
      photo_path = @photo_path, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    name: input.name,
    role: input.role,
    quote: input.quote,
    hue: input.hue,
    photo_path: input.photoPath ?? null,
  });
  return getTestimonialById(id);
}

export function deleteTestimonial(id: number): boolean {
  const result = db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
  return result.changes > 0;
}
