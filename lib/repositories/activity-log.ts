// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";

export type ActivityLogEntry = {
  id: number;
  userId: number | null;
  username: string;
  action: string;
  target: string | null;
  createdAt: string;
};

type ActivityLogRow = {
  id: number;
  user_id: number | null;
  username: string;
  action: string;
  target: string | null;
  created_at: string;
};

function mapRow(row: ActivityLogRow): ActivityLogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    action: row.action,
    target: row.target,
    createdAt: row.created_at,
  };
}

export function logActivity(entry: { userId: number; username: string; action: string; target?: string }) {
  db.prepare(
    `INSERT INTO activity_log (user_id, username, action, target)
     VALUES (@userId, @username, @action, @target)`
  ).run({
    userId: entry.userId,
    username: entry.username,
    action: entry.action,
    target: entry.target ?? null,
  });
}

const PAGE_SIZE = 50;

export function listActivity(beforeId?: number): { entries: ActivityLogEntry[]; hasMore: boolean } {
  const rows = beforeId
    ? (db
        .prepare("SELECT * FROM activity_log WHERE id < ? ORDER BY id DESC LIMIT ?")
        .all(beforeId, PAGE_SIZE + 1) as ActivityLogRow[])
    : (db
        .prepare("SELECT * FROM activity_log ORDER BY id DESC LIMIT ?")
        .all(PAGE_SIZE + 1) as ActivityLogRow[]);

  const hasMore = rows.length > PAGE_SIZE;
  return { entries: rows.slice(0, PAGE_SIZE).map(mapRow), hasMore };
}
