// Author: Zeday | https://join.co.id
// Login sekali lalu simpan cookie sesi (storageState), dipakai ulang oleh
// semua spec admin lain. Tanpa ini, tiap file test login sendiri-sendiri
// lewat UI dan dengan cepat kena rate limit /api/admin/login (5x/60 detik)
// yang sengaja dipasang untuk mencegah brute-force password admin.
import { test as setup } from "@playwright/test";
import { E2E_ADMIN_PASSWORD } from "../../playwright.config";

const authFile = "playwright/.auth/admin.json";

setup("login sebagai admin", async ({ page }) => {
  await page.goto("/admin");
  await page.fill("#password", E2E_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL(/\/admin\/pengaturan$/);
  await page.context().storageState({ path: authFile });
});
