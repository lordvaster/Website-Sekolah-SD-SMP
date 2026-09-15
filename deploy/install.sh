#!/usr/bin/env bash
# Author: Zeday | https://join.co.id
#
# Instalasi awal di VPS BARU yang masih kosong (mis. server milik klien
# lain yang membeli paket ini). Bukan untuk update server yang sudah
# berjalan - untuk itu pakai deploy/deploy.sh.
#
# Prasyarat sebelum menjalankan:
#   - VPS Debian/Ubuntu (pakai apt) dengan akses root
#   - Node.js >=20.9 sudah terpasang (mis. via NodeSource/nvm)
#   - Domain klien sudah diarahkan (DNS A record) ke IP VPS ini,
#     kalau belum, permintaan sertifikat SSL di akhir script akan gagal
#
# Pakai:
#   sudo bash deploy/install.sh <domain> <email-untuk-ssl> [repo-git] [folder-tujuan]
#
# Contoh clone baru:
#   sudo bash deploy/install.sh sdmaju.sch.id admin@sdmaju.sch.id \
#     git@github.com:lordvaster/Website-Sekolah-SD-SMP.git /var/www/sdmaju
#
# Contoh kalau folder proyek sudah di-clone manual sebelumnya:
#   cd /var/www/sdmaju && sudo bash deploy/install.sh sdmaju.sch.id admin@sdmaju.sch.id

set -euo pipefail

DOMAIN="${1:?Domain wajib diisi. Contoh: sudo bash deploy/install.sh sdmaju.sch.id admin@sdmaju.sch.id}"
CERT_EMAIL="${2:?Email untuk sertifikat SSL (Certbot) wajib diisi}"
REPO_URL="${3:-}"
TARGET_DIR="${4:-/var/www/${DOMAIN}}"

if [ "$EUID" -ne 0 ]; then
  echo "Jalankan script ini sebagai root (pakai sudo)." >&2
  exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "Script ini hanya mendukung distro berbasis apt (Debian/Ubuntu)." >&2
  echo "Instal nginx, certbot, dan git secara manual di distro lain, lalu jalankan ulang." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js belum terpasang. Instal Node.js >=20.9 dulu (NodeSource/nvm), lalu jalankan ulang script ini." >&2
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Versi Node.js terlalu lama ($(node -v)). Perlu >=20.9." >&2
  exit 1
fi

echo "==> Memasang paket sistem (nginx, certbot, git) bila belum ada..."
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx git

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Memasang PM2 secara global..."
  npm install -g pm2
fi

if [ -n "$REPO_URL" ]; then
  if [ -d "$TARGET_DIR/.git" ]; then
    echo "==> Folder $TARGET_DIR sudah berisi repo git, lewati clone."
  else
    echo "==> Meng-clone repo ke $TARGET_DIR..."
    git clone "$REPO_URL" "$TARGET_DIR"
  fi
elif [ ! -d "$TARGET_DIR" ]; then
  echo "Folder $TARGET_DIR belum ada dan repo-git tidak diberikan sebagai argumen ke-3." >&2
  exit 1
fi

cd "$TARGET_DIR"

if [ ! -f .env ]; then
  echo "==> Membuat .env baru dari .env.example..."
  cp .env.example .env
  GENERATED_PASSWORD=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | cut -c1-20)
  sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://${DOMAIN}|" .env
  sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${GENERATED_PASSWORD}|" .env
  echo
  echo "    Password admin awal (dibuat otomatis, catat sekarang): ${GENERATED_PASSWORD}"
  echo
  echo "    .env sudah dibuat, tapi SMTP_*, CONTACT_RECEIVER_EMAIL, dan"
  echo "    NEXT_PUBLIC_SHOW_DEVELOPER_CREDIT masih nilai contoh - wajib diisi"
  echo "    sesuai data sekolah/klien ini sebelum lanjut."
  echo
  "${EDITOR:-nano}" .env
else
  echo "==> .env sudah ada, tidak ditimpa. Pastikan isinya sudah sesuai domain/klien ini."
fi

echo "==> Memasang dependency & build production..."
npm ci
npm run build
mkdir -p logs

echo "==> Menjalankan lewat PM2..."
if pm2 describe sd-inovasi-ceria > /dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --env production
else
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

STARTUP_CMD=$(pm2 startup systemd -u root --hp /root 2>/dev/null | tail -n1 || true)
if [[ "$STARTUP_CMD" == sudo* ]]; then
  echo "==> Mengaktifkan PM2 otomatis saat boot..."
  eval "$STARTUP_CMD"
fi

echo "==> Menyiapkan reverse proxy Nginx untuk ${DOMAIN}..."
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
sed "s/sd\.join\.co\.id/${DOMAIN}/g" deploy/nginx.conf.example > "$NGINX_CONF"
ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t
systemctl reload nginx

echo "==> Meminta sertifikat SSL (Let's Encrypt) untuk ${DOMAIN}..."
echo "    (gagal di sini biasanya berarti DNS domain belum mengarah ke IP VPS ini)"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$CERT_EMAIL" --redirect

echo
echo "==> Selesai. Situs seharusnya sudah bisa diakses di https://${DOMAIN}"
echo "    Cek proses   : pm2 status"
echo "    Login admin  : https://${DOMAIN}/admin"
echo "    Ganti konten dummy (berita/galeri/guru/program/pengaturan) lewat panel admin sebelum go-live publik."
