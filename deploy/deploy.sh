#!/usr/bin/env bash
# Author: Zeday | https://join.co.id
#
# Script deploy manual di server produksi (VPS). Jalankan dari root
# folder proyek: bash deploy/deploy.sh
#
# TIDAK menyentuh data/ (database CMS) atau public/uploads/ (foto admin)
# karena keduanya di-gitignore - "git pull" tidak akan menghapusnya.
set -euo pipefail

echo "==> Menarik kode terbaru dari GitHub..."
git pull --ff-only

echo "==> Memasang dependency (termasuk kompilasi ulang better-sqlite3 bila perlu)..."
npm ci

echo "==> Build production..."
npm run build

echo "==> Mengaktifkan/reload proses PM2..."
if pm2 describe sd-inovasi-ceria > /dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --env production
else
  pm2 start ecosystem.config.cjs --env production
  pm2 save
fi

echo "==> Selesai. Cek status dengan: pm2 status"
