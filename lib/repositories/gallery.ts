// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type GalleryCategory = "Kelas" | "Acara" | "Aktivitas";

export type GalleryItem = {
  id: number;
  caption: string;
  category: GalleryCategory;
  hue: number;
  imagePath: string | null;
};

type GalleryRow = {
  id: number;
  caption: string;
  category: string;
  hue: number;
  image_path: string | null;
};

function mapRow(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    caption: row.caption,
    category: row.category as GalleryCategory,
    hue: row.hue,
    imagePath: row.image_path,
  };
}

export function listGalleryItems(): GalleryItem[] {
  const rows = db
    .prepare("SELECT * FROM gallery_items ORDER BY sort_order ASC, id DESC")
    .all() as GalleryRow[];
  return rows.map(mapRow);
}

export function getGalleryItemById(id: number): GalleryItem | undefined {
  const row = db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id) as
    | GalleryRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type GalleryInput = {
  caption: string;
  category: GalleryCategory;
  hue: number;
  imagePath?: string | null;
};

export function createGalleryItem(input: GalleryInput): GalleryItem {
  const result = db
    .prepare(
      `INSERT INTO gallery_items (caption, category, hue, image_path)
       VALUES (@caption, @category, @hue, @image_path)`
    )
    .run({
      caption: input.caption,
      category: input.category,
      hue: input.hue,
      image_path: input.imagePath ?? null,
    });
  return getGalleryItemById(Number(result.lastInsertRowid))!;
}

export function deleteGalleryItem(id: number): boolean {
  const result = db.prepare("DELETE FROM gallery_items WHERE id = ?").run(id);
  return result.changes > 0;
}
