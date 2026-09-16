// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type Faq = {
  id: number;
  question: string;
  answer: string;
};

type FaqRow = {
  id: number;
  question: string;
  answer: string;
};

function mapRow(row: FaqRow): Faq {
  return { id: row.id, question: row.question, answer: row.answer };
}

export function listFaqs(): Faq[] {
  const rows = db.prepare("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC").all() as FaqRow[];
  return rows.map(mapRow);
}

export function getFaqById(id: number): Faq | undefined {
  const row = db.prepare("SELECT * FROM faqs WHERE id = ?").get(id) as FaqRow | undefined;
  return row ? mapRow(row) : undefined;
}

export type FaqInput = {
  question: string;
  answer: string;
};

export function createFaq(input: FaqInput): Faq {
  const result = db
    .prepare("INSERT INTO faqs (question, answer) VALUES (@question, @answer)")
    .run(input);
  return getFaqById(Number(result.lastInsertRowid))!;
}

export function updateFaq(id: number, input: FaqInput): Faq | undefined {
  db.prepare(
    "UPDATE faqs SET question = @question, answer = @answer, updated_at = datetime('now') WHERE id = @id"
  ).run({ id, ...input });
  return getFaqById(id);
}

export function deleteFaq(id: number): boolean {
  const result = db.prepare("DELETE FROM faqs WHERE id = ?").run(id);
  return result.changes > 0;
}
