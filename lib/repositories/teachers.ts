// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type Teacher = {
  id: number;
  slug: string;
  name: string;
  role: string;
  subject: string;
  bio: string;
  hue: number;
  photoPath: string | null;
};

type TeacherRow = {
  id: number;
  slug: string;
  name: string;
  role: string;
  subject: string;
  bio: string;
  hue: number;
  photo_path: string | null;
};

function mapRow(row: TeacherRow): Teacher {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    subject: row.subject,
    bio: row.bio,
    hue: row.hue,
    photoPath: row.photo_path,
  };
}

export function listTeachers(): Teacher[] {
  const rows = db
    .prepare("SELECT * FROM teachers ORDER BY sort_order ASC, id ASC")
    .all() as TeacherRow[];
  return rows.map(mapRow);
}

export function getTeacherById(id: number): Teacher | undefined {
  const row = db.prepare("SELECT * FROM teachers WHERE id = ?").get(id) as
    | TeacherRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type TeacherInput = {
  slug: string;
  name: string;
  role: string;
  subject: string;
  bio: string;
  hue: number;
  photoPath?: string | null;
};

export function createTeacher(input: TeacherInput): Teacher {
  const result = db
    .prepare(
      `INSERT INTO teachers (slug, name, role, subject, bio, hue, photo_path)
       VALUES (@slug, @name, @role, @subject, @bio, @hue, @photo_path)`
    )
    .run({
      slug: input.slug,
      name: input.name,
      role: input.role,
      subject: input.subject,
      bio: input.bio,
      hue: input.hue,
      photo_path: input.photoPath ?? null,
    });
  return getTeacherById(Number(result.lastInsertRowid))!;
}

export function updateTeacher(id: number, input: TeacherInput): Teacher | undefined {
  db.prepare(
    `UPDATE teachers SET
      slug = @slug, name = @name, role = @role, subject = @subject,
      bio = @bio, hue = @hue, photo_path = @photo_path, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    slug: input.slug,
    name: input.name,
    role: input.role,
    subject: input.subject,
    bio: input.bio,
    hue: input.hue,
    photo_path: input.photoPath ?? null,
  });
  return getTeacherById(id);
}

export function deleteTeacher(id: number) {
  db.prepare("DELETE FROM teachers WHERE id = ?").run(id);
}
