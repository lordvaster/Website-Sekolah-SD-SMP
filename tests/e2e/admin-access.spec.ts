// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";
import { E2E_ADMIN_PASSWORD } from "../../playwright.config";

// File ini justru menguji kondisi belum login (dan alur login itu
// sendiri), jadi cookie sesi bersama dari auth.setup.ts sengaja tidak
// dipakai di sini - mulai dari context yang benar-benar kosong.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Akses panel admin", () => {
  test("halaman login tetap bisa diakses tanpa sesi", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Login Admin" })).toBeVisible();
  });

  test("halaman admin manapun redirect ke login tanpa sesi", async ({ page }) => {
    for (const path of ["/admin/pengaturan", "/admin/berita", "/admin/pendaftaran"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin$/);
    }
  });

  test("password salah menampilkan pesan error", async ({ page }) => {
    await page.goto("/admin");
    await page.fill("#password", "password-salah-sekali");
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.locator('p[role="alert"]')).toHaveText(/password salah/i);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("password benar login dan redirect ke pengaturan", async ({ page }) => {
    await page.goto("/admin");
    await page.fill("#password", E2E_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page).toHaveURL(/\/admin\/pengaturan$/);
    await expect(page.getByRole("heading", { name: "Pengaturan Situs" })).toBeVisible();

    await page.getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/pengaturan");
    await expect(page).toHaveURL(/\/admin$/);
  });
});
