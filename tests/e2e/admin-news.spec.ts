// Author: Zeday | https://join.co.id
import path from "node:path";
import { test, expect } from "@playwright/test";

const IMAGE = path.join(__dirname, "fixtures", "test-image.png");

test.describe("CRUD Berita", () => {
  test("tulis, tampil di publik, edit, lalu hapus", async ({ page }) => {
    // Akhiran unik supaya retry tidak bentrok dengan sisa data dari
    // percobaan sebelumnya yang gagal di tengah jalan.
    const TITLE = `Berita Uji E2E ${Date.now()}`;
    const TITLE_EDITED = `${TITLE} (Diedit)`;

    await page.goto("/admin/berita/baru");
    await page.fill("#title", TITLE);
    await page.fill("#excerpt", "Ringkasan berita untuk keperluan uji otomatis end-to-end.");
    await page.fill("#author", "Playwright Bot");
    await page.fill(
      "#content",
      "Paragraf pertama.\n\nParagraf kedua untuk memastikan pemisahan paragraf berfungsi."
    );
    await page.setInputFiles('input[type="file"]', IMAGE);
    await expect(page.locator("img[alt='']").first()).toBeVisible();
    await page.getByRole("button", { name: "Terbitkan Berita" }).click();
    await page.waitForURL(/\/admin\/berita$/);
    await expect(page.getByRole("cell", { name: TITLE })).toBeVisible();

    // Tampil di halaman publik dengan gambar yang diunggah
    await page.goto("/berita");
    await expect(page.getByRole("heading", { name: TITLE })).toBeVisible();
    await page.getByRole("heading", { name: TITLE }).click();
    await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();
    await expect(page.locator("article img")).toBeVisible();

    // Edit
    await page.goto("/admin/berita");
    await page
      .getByRole("row", { name: new RegExp(TITLE) })
      .getByLabel("Edit")
      .click();
    await page.fill("#title", TITLE_EDITED);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/berita$/);
    await expect(page.getByRole("cell", { name: TITLE_EDITED })).toBeVisible();

    // Hapus
    page.once("dialog", (d) => d.accept());
    await page
      .getByRole("row", { name: new RegExp(TITLE_EDITED.replace(/[()]/g, "\\$&")) })
      .getByLabel("Hapus")
      .click();
    await expect(page.getByRole("cell", { name: TITLE_EDITED })).toHaveCount(0);
  });
});
