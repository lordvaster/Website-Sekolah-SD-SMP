#!/usr/bin/env bash
# Author: Zeday | https://join.co.id
#
# Backup harian: snapshot database yang konsisten (lewat SQLite Online
# Backup API - lihat scripts/backup-db.cjs, bukan tar mentah yang berisiko
# dapat data setengah-jadi saat mode WAL sedang menulis), settings.json,
# dan public/uploads/. Dikemas jadi satu arsip .tar.gz per hari, disimpan
# lokal dengan rotasi, dan diunggah ke penyimpanan DI LUAR SERVER INI bila
# rclone sudah dikonfigurasi (lihat README bagian "Backup Otomatis" untuk
# setup rclone sekali di awal - proses interaktif yang tidak bisa
# diotomatiskan sepenuhnya lewat script, perlu login/API key milik anda).
#
# Pakai manual:
#   bash deploy/backup.sh
#
# Cron harian (jam 2 pagi - sesuaikan; dipasang otomatis oleh install.sh):
#   0 2 * * * cd /path/proyek && bash deploy/backup.sh >> logs/backup.log 2>&1

set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
DB_PATH="${CMS_DB_PATH:-data/cms.sqlite}"
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups"
STAGING_DIR=$(mktemp -d)
trap 'rm -rf "$STAGING_DIR"' EXIT

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

if [ ! -f "$DB_PATH" ]; then
  echo "Database $DB_PATH tidak ditemukan - lewati backup." >&2
  exit 1
fi

echo "==> Membuat snapshot database yang konsisten..."
node scripts/backup-db.cjs "$DB_PATH" "$STAGING_DIR/cms.sqlite"

[ -f data/settings.json ] && cp data/settings.json "$STAGING_DIR/settings.json"

ARCHIVE="$BACKUP_DIR/backup-${STAMP}.tar.gz"
echo "==> Mengemas arsip $ARCHIVE..."

TAR_ARGS=(-C "$STAGING_DIR" cms.sqlite)
[ -f "$STAGING_DIR/settings.json" ] && TAR_ARGS+=(settings.json)
if [ -d public/uploads ] && [ -n "$(ls -A public/uploads 2>/dev/null)" ]; then
  TAR_ARGS+=(-C "$(pwd)" public/uploads)
fi

tar -czf "$ARCHIVE" "${TAR_ARGS[@]}"
# Arsip ini berisi data pribadi calon siswa (nama, email, telepon dari
# pendaftaran) - jangan bisa dibaca user lain di server yang sama.
chmod 600 "$ARCHIVE"

echo "==> Menghapus arsip lokal lebih tua dari ${RETENTION_DAYS} hari..."
find "$BACKUP_DIR" -name 'backup-*.tar.gz' -mtime "+${RETENTION_DAYS}" -delete

if [ -n "${BACKUP_RCLONE_REMOTE:-}" ]; then
  if command -v rclone >/dev/null 2>&1; then
    echo "==> Mengunggah ke ${BACKUP_RCLONE_REMOTE}..."
    rclone copy "$ARCHIVE" "$BACKUP_RCLONE_REMOTE"
    rclone delete "$BACKUP_RCLONE_REMOTE" --min-age "${RETENTION_DAYS}d" || true
  else
    echo "PERINGATAN: BACKUP_RCLONE_REMOTE diisi tapi rclone belum terpasang - backup HANYA tersimpan lokal di VPS ini." >&2
  fi
else
  echo "INFO: BACKUP_RCLONE_REMOTE belum diisi di .env - backup HANYA tersimpan lokal di VPS ini," >&2
  echo "      TIDAK aman dari kegagalan/kehilangan VPS ini sendiri. Lihat README bagian \"Backup Otomatis\"." >&2
fi

echo "==> Selesai: $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"
