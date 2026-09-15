// Author: Zeday | https://join.co.id
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
export const E2E_ADMIN_PASSWORD = "playwright-e2e-password";

export default defineConfig({
  testDir: "./tests/e2e",
  // Test-test admin di sini membaca/menulis ke satu file SQLite bersama
  // (lihat CMS_DB_PATH di bawah), jadi dijalankan berurutan (bukan
  // paralel) supaya satu test tidak mengubah data yang sedang diperiksa
  // test lain secara bersamaan.
  workers: 1,
  fullyParallel: false,
  // Satu retry dipakai baik lokal maupun CI: `next dev` (dipilih di sini
  // demi konten yang selalu segar tanpa perlu revalidasi ISR) kadang
  // melambat sesaat di bawah beban berurutan banyak test; retry menutupi
  // kelambatan sesaat itu tanpa menyembunyikan kegagalan yang konsisten.
  retries: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Sesi admin login sekali di auth.setup.ts dan cookie-nya dipakai
        // ulang di sini - spec yang justru perlu menguji kondisi belum
        // login (mis. admin-access.spec.ts) menimpanya sendiri lewat
        // test.use({ storageState: { cookies: [], origins: [] } }).
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev -- --port " + PORT,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      ADMIN_PASSWORD: E2E_ADMIN_PASSWORD,
      CMS_DB_PATH: "./data/cms.e2e-test.sqlite",
      // Nginx (yang menimpa x-real-ip di produksi) tidak ada di depan
      // `next dev` saat E2E - semua request jadi terlihat berasal dari IP
      // "unknown" yang sama, jadi login berulang antar spec + retry bisa
      // kena rate-limit /api/admin/login (5x/60 detik) meski dari "user"
      // yang berbeda. Tidak ada spec yang menguji perilaku 429 itu sendiri,
      // jadi aman dilewati khusus di lingkungan test ini saja.
      E2E_TEST_MODE: "true",
    },
  },
});
