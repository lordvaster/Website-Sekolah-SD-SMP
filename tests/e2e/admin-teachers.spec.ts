// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD Guru", () => {
  test("tambah profil, tampil di halaman Tentang, edit, lalu hapus", async ({ page }) => {
    const NAME = `Guru Uji E2E ${Date.now()}`;

    await page.goto("/admin/guru/baru");
    await page.fill("#name", NAME);
    await page.fill("#role", "Guru Tamu");
    await page.fill("#subject", "Pengujian Otomatis");
    await page.fill("#bio", "Bio singkat untuk keperluan pengujian end-to-end profil guru.");
    await page.getByRole("button", { name: "Tambah Guru" }).click();
    await page.waitForURL(/\/admin\/guru$/);
    await expect(page.getByText(NAME)).toBeVisible();

    await page.goto("/tentang");
    await expect(page.getByRole("heading", { name: NAME })).toBeVisible();

    await page.goto("/admin/guru");
    await page.locator(".card").filter({ hasText: NAME }).getByLabel("Edit").click();
    await page.fill("#role", "Guru Tamu (Diedit)");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/guru$/);
    await expect(page.getByText("Guru Tamu (Diedit)")).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page.locator(".card").filter({ hasText: NAME }).getByLabel("Hapus").click();
    await expect(page.getByText(NAME)).toHaveCount(0);
  });
});
