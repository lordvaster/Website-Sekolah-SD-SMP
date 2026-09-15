// Author: Zeday | https://join.co.id
import path from "node:path";
import { test, expect } from "@playwright/test";

const IMAGE = path.join(__dirname, "fixtures", "test-image.png");

test.describe("CRUD Galeri", () => {
  test("unggah foto, tampil di publik, lalu hapus", async ({ page }) => {
    const CAPTION = `Foto Uji E2E ${Date.now()}`;

    await page.goto("/admin/galeri/baru");
    await page.setInputFiles('input[type="file"]', IMAGE);
    await expect(page.locator("img[alt='']").first()).toBeVisible();
    await page.fill("#caption", CAPTION);
    await page.getByRole("button", { name: "Simpan ke Galeri" }).click();
    await page.waitForURL(/\/admin\/galeri$/);
    await expect(page.getByText(CAPTION)).toBeVisible();

    await page.goto("/galeri");
    await expect(page.getByRole("button", { name: CAPTION })).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page.goto("/admin/galeri");
    await page
      .locator(".card")
      .filter({ hasText: CAPTION })
      .getByLabel("Hapus")
      .click();
    await expect(page.getByText(CAPTION)).toHaveCount(0);
  });
});
