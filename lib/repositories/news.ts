// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type NewsCategory = "Prestasi" | "Kegiatan" | "Pengumuman" | "Tips Parenting";

export type NewsArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: NewsCategory;
  author: string;
  date: string;
  hue: number;
  imagePath: string | null;
};

type NewsRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_json: string;
  category: string;
  author: string;
  published_date: string;
  hue: number;
  image_path: string | null;
};

function mapRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: JSON.parse(row.content_json),
    category: row.category as NewsCategory,
    author: row.author,
    date: row.published_date,
    hue: row.hue,
    imagePath: row.image_path,
  };
}

export function listNews(): NewsArticle[] {
  const rows = db
    .prepare("SELECT * FROM news ORDER BY published_date DESC, id DESC")
    .all() as NewsRow[];
  return rows.map(mapRow);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  const row = db.prepare("SELECT * FROM news WHERE slug = ?").get(slug) as
    | NewsRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getNewsById(id: number): NewsArticle | undefined {
  const row = db.prepare("SELECT * FROM news WHERE id = ?").get(id) as
    | NewsRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export type NewsInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: NewsCategory;
  author: string;
  date: string;
  hue: number;
  imagePath?: string | null;
};

export function createNews(input: NewsInput): NewsArticle {
  const result = db
    .prepare(
      `INSERT INTO news (slug, title, excerpt, content_json, category, author, published_date, hue, image_path)
       VALUES (@slug, @title, @excerpt, @content_json, @category, @author, @date, @hue, @image_path)`
    )
    .run({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content_json: JSON.stringify(input.content),
      category: input.category,
      author: input.author,
      date: input.date,
      hue: input.hue,
      image_path: input.imagePath ?? null,
    });
  return getNewsById(Number(result.lastInsertRowid))!;
}

export function updateNews(id: number, input: NewsInput): NewsArticle | undefined {
  db.prepare(
    `UPDATE news SET
      slug = @slug,
      title = @title,
      excerpt = @excerpt,
      content_json = @content_json,
      category = @category,
      author = @author,
      published_date = @date,
      hue = @hue,
      image_path = @image_path,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content_json: JSON.stringify(input.content),
    category: input.category,
    author: input.author,
    date: input.date,
    hue: input.hue,
    image_path: input.imagePath ?? null,
  });
  return getNewsById(id);
}

export function deleteNews(id: number) {
  db.prepare("DELETE FROM news WHERE id = ?").run(id);
}
