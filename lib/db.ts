// Author: Zeday | https://join.co.id
// Lapisan database CMS (berita, galeri, guru, program, pendaftaran).
//
// PENTING soal deployment: better-sqlite3 menulis ke sebuah file di disk
// (data/cms.sqlite). Ini bekerja baik di server Node.js biasa (VPS) yang
// disknya persisten antar-request. Di platform serverless seperti Vercel,
// filesystem bersifat sementara (reset tiap deploy/instance baru) - jadi
// SEMUA isi CMS (berita/galeri/guru/program/pendaftaran yang ditambah
// admin, dan foto yang diunggah) akan HILANG. Untuk deploy ke Vercel,
// ganti lapisan ini dengan database eksternal (Vercel Postgres, Neon,
// Turso, dll). Lihat README bagian "Database & Penyimpanan File".
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// CMS_DB_PATH memungkinkan test E2E (lihat playwright.config.ts) memakai
// file database sekali-pakai yang terpisah dari data/cms.sqlite yang
// sungguhan, supaya menjalankan test tidak ikut mengotori/menghapus data
// asli sekolah.
const dbPath = process.env.CMS_DB_PATH
  ? path.resolve(process.env.CMS_DB_PATH)
  : path.join(process.cwd(), "data", "cms.sqlite");
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Singleton koneksi per-proses. Route handler Next.js (Node.js runtime)
// menjalankan modul ini sekali per proses server, jadi ini aman dipakai
// bersama oleh semua request tanpa membuka koneksi berulang kali.
declare global {
  var __sdCeriaDb: Database.Database | undefined;
}

function createConnection() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  // Tanpa ini, proses lain yang sempat memegang write lock di file yang
  // sama (mis. `sqlite3 data/cms.sqlite ".backup ..."` atau VACUUM manual)
  // akan membuat query dari sini langsung gagal dengan SQLITE_BUSY alih-alih
  // menunggu sebentar - default better-sqlite3 adalah 0ms (tidak menunggu).
  db.pragma("busy_timeout = 5000");
  return db;
}

export const db = globalThis.__sdCeriaDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalThis.__sdCeriaDb = db;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content_json TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    published_date TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    image_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caption TEXT NOT NULL,
    category TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    image_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    subject TEXT NOT NULL,
    bio TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    photo_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    age_range TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights_json TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    photo_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    year TEXT NOT NULL,
    hue INTEGER NOT NULL DEFAULT 205,
    image_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    category TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    active INTEGER NOT NULL DEFAULT 1,
    two_factor_enabled INTEGER NOT NULL DEFAULT 0,
    two_factor_secret TEXT,
    two_factor_pending_secret TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Snapshot username disimpan terpisah dari user_id (bukan cuma JOIN) supaya
  -- riwayat tetap terbaca dengan jelas walau akun pelakunya sudah dihapus.
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_name TEXT NOT NULL,
    child_age INTEGER NOT NULL,
    program TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'baru',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed data awal dijalankan dari instrumentation.ts (register()), bukan di
// sini - itu adalah satu-satunya hook Next.js yang dijamin selesai duluan
// sebelum server mulai melayani request, sehingga tidak ada race condition
// antara "server sudah menerima request" vs "seed belum selesai menulis".
