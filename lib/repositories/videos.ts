// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type VideoCategory = "Profil Sekolah" | "Testimoni" | "Virtual Tour";

export type Video = {
  id: number;
  title: string;
  youtubeId: string;
  category: VideoCategory;
};

type VideoRow = {
  id: number;
  title: string;
  youtube_id: string;
  category: string;
};

function mapRow(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    youtubeId: row.youtube_id,
    category: row.category as VideoCategory,
  };
}

export function listVideos(): Video[] {
  const rows = db.prepare("SELECT * FROM videos ORDER BY sort_order ASC, id ASC").all() as VideoRow[];
  return rows.map(mapRow);
}

export function getVideoById(id: number): Video | undefined {
  const row = db.prepare("SELECT * FROM videos WHERE id = ?").get(id) as VideoRow | undefined;
  return row ? mapRow(row) : undefined;
}

export type VideoInput = {
  title: string;
  youtubeId: string;
  category: VideoCategory;
};

export function createVideo(input: VideoInput): Video {
  const result = db
    .prepare(
      `INSERT INTO videos (title, youtube_id, category) VALUES (@title, @youtubeId, @category)`
    )
    .run(input);
  return getVideoById(Number(result.lastInsertRowid))!;
}

export function updateVideo(id: number, input: VideoInput): Video | undefined {
  db.prepare(
    `UPDATE videos SET title = @title, youtube_id = @youtubeId, category = @category,
      updated_at = datetime('now') WHERE id = @id`
  ).run({ id, ...input });
  return getVideoById(id);
}

export function deleteVideo(id: number): boolean {
  const result = db.prepare("DELETE FROM videos WHERE id = ?").run(id);
  return result.changes > 0;
}
