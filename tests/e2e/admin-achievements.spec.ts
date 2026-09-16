// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD Prestasi", () => {
  test("tambah prestasi, tampil di halaman Tentang, edit, lalu hapus", async ({ page }) => {
    const TITLE = `Prestasi Uji E2E ${Date.now()}`;

    await page.goto("/admin/prestasi/baru");
    await page.fill("#title", TITLE);
    await page.fill("#description", "Keterangan pengujian end-to-end prestasi.");
    await page.fill("#year", "2026");
    await page.getByRole("button", { name: "Tambah Prestasi" }).click();
    await page.waitForURL(/\/admin\/prestasi$/);
    // Tanpa foto asli, placeholder SVG-nya juga menuliskan judul lengkap di
    // dalam <text> (lihat PlaceholderPhoto variant="photo") - scope ke
    // ".card" supaya tidak bentrok dengan teks di dalam SVG placeholder itu.
    await expect(page.locator(".card").filter({ hasText: TITLE })).toBeVisible();

    await page.goto("/tentang");
    await expect(page.locator(".card").filter({ hasText: TITLE })).toBeVisible();

    await page.goto("/admin/prestasi");
    await page.locator(".card").filter({ hasText: TITLE }).getByLabel("Edit").click();
    await page.fill("#description", "Keterangan yang sudah diedit.");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/prestasi$/);
    await expect(page.getByText("Keterangan yang sudah diedit.")).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page.locator(".card").filter({ hasText: TITLE }).getByLabel("Hapus").click();
    await expect(page.getByText(TITLE)).toHaveCount(0);
  });
});
