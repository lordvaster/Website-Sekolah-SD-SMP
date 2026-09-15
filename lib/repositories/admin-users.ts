// Author: Zeday | https://join.co.id
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type AdminRole = "owner" | "editor";

export type AdminUser = {
  id: number;
  username: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  active: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorPendingSecret: string | null;
  createdAt: string;
  updatedAt: string;
};

// Bentuk aman-publik (tanpa hash password / secret 2FA) untuk dikirim ke
// client, mis. daftar pengguna di halaman admin.
export type AdminUserSummary = Omit<
  AdminUser,
  "passwordHash" | "twoFactorSecret" | "twoFactorPendingSecret"
>;

type AdminUserRow = {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  role: string;
  active: number;
  two_factor_enabled: number;
  two_factor_secret: string | null;
  two_factor_pending_secret: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role as AdminRole,
    active: Boolean(row.active),
    twoFactorEnabled: Boolean(row.two_factor_enabled),
    twoFactorSecret: row.two_factor_secret,
    twoFactorPendingSecret: row.two_factor_pending_secret,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Daftar putih (allow-list) eksplisit alih-alih "hapus field sensitif" -
// field baru yang ditambahkan ke AdminUser nanti default TIDAK ikut
// terkirim ke client kecuali sengaja ditambahkan di sini.
export function toSummary(user: AdminUser): AdminUserSummary {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    active: user.active,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function listAdminUsers(): AdminUser[] {
  const rows = db.prepare("SELECT * FROM admin_users ORDER BY id ASC").all() as AdminUserRow[];
  return rows.map(mapRow);
}

export function countAdminUsers(): number {
  const row = db.prepare("SELECT COUNT(*) as c FROM admin_users").get() as { c: number };
  return row.c;
}

export function countActiveOwners(excludingId?: number): number {
  const row = db
    .prepare(
      "SELECT COUNT(*) as c FROM admin_users WHERE role = 'owner' AND active = 1" +
        (excludingId ? " AND id != ?" : "")
    )
    .get(...(excludingId ? [excludingId] : [])) as { c: number };
  return row.c;
}

export function getAdminUserById(id: number): AdminUser | undefined {
  const row = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id) as
    | AdminUserRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getAdminUserByUsername(username: string): AdminUser | undefined {
  const row = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as
    | AdminUserRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export async function createAdminUser(input: {
  username: string;
  name: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> {
  const passwordHash = await hashPassword(input.password);
  const result = db
    .prepare(
      `INSERT INTO admin_users (username, name, password_hash, role)
       VALUES (@username, @name, @password_hash, @role)`
    )
    .run({
      username: input.username,
      name: input.name,
      password_hash: passwordHash,
      role: input.role,
    });
  return getAdminUserById(Number(result.lastInsertRowid))!;
}

export function updateAdminUser(
  id: number,
  input: { name: string; role: AdminRole; active: boolean }
): AdminUser | undefined {
  db.prepare(
    `UPDATE admin_users SET name = @name, role = @role, active = @active, updated_at = datetime('now')
     WHERE id = @id`
  ).run({ id, name: input.name, role: input.role, active: input.active ? 1 : 0 });
  return getAdminUserById(id);
}

export async function setAdminUserPassword(id: number, password: string): Promise<void> {
  const passwordHash = await hashPassword(password);
  db.prepare(
    "UPDATE admin_users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(passwordHash, id);
}

export function deleteAdminUser(id: number): boolean {
  const result = db.prepare("DELETE FROM admin_users WHERE id = ?").run(id);
  return result.changes > 0;
}

export function setTwoFactorPendingSecret(id: number, secret: string) {
  db.prepare(
    "UPDATE admin_users SET two_factor_pending_secret = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(secret, id);
}

export function activateTwoFactor(id: number, secret: string) {
  db.prepare(
    `UPDATE admin_users SET
      two_factor_enabled = 1, two_factor_secret = ?, two_factor_pending_secret = NULL,
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(secret, id);
}

export function deactivateTwoFactor(id: number) {
  db.prepare(
    `UPDATE admin_users SET
      two_factor_enabled = 0, two_factor_secret = NULL, two_factor_pending_secret = NULL,
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(id);
}
