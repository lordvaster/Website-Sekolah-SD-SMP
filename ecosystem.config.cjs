// Author: Zeday | https://join.co.id
// Konfigurasi PM2 untuk menjalankan situs di server produksi (VPS).
// Pakai: pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: "sd-inovasi-ceria",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      // Jangan pakai mode "cluster" - better-sqlite3 (lib/db.ts) membuka
      // satu file database secara langsung; menjalankan lebih dari satu
      // proses Node terhadap file yang sama berisiko konflik penulisan.
      // Kalau butuh menangani lebih banyak trafik, taruh Nginx di depan
      // sebagai load balancer ke beberapa domain/port dengan database
      // terpisah, atau migrasikan ke database server (lihat README).
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "512M",
      autorestart: true,
      watch: false,
      time: true,
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
    },
  ],
};
