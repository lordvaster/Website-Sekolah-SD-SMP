// Author: Zeday | https://join.co.id
//
// Menyalin database SQLite dengan aman ke file tujuan lewat SQLite Online
// Backup API (via better-sqlite3), BUKAN `cp`/`tar` mentah terhadap file
// .sqlite yang sedang dipakai server produksi - salinan mentah berisiko
// mendapat data setengah-jadi karena mode WAL menulis ke file -wal terpisah
// yang belum tentu ikut ter-checkpoint saat file utama disalin.
//
// Pakai: node scripts/backup-db.cjs <sumber.sqlite> <tujuan.sqlite>
const Database = require("better-sqlite3");

const [, , sourcePath, destPath] = process.argv;
if (!sourcePath || !destPath) {
  console.error("Pakai: node scripts/backup-db.cjs <sumber.sqlite> <tujuan.sqlite>");
  process.exit(1);
}

const db = new Database(sourcePath, { readonly: true });
db.backup(destPath)
  .then(() => {
    db.close();
    console.log(`Snapshot database tersimpan: ${destPath}`);
  })
  .catch((error) => {
    console.error("Gagal membuat snapshot database:", error);
    process.exit(1);
  });
