// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD FAQ", () => {
  test("tambah FAQ, tampil di halaman Kontak, edit, lalu hapus", async ({ page }) => {
    const QUESTION = `Pertanyaan Uji E2E ${Date.now()}?`;

    await page.goto("/admin/faq/baru");
    await page.fill("#question", QUESTION);
    await page.fill("#answer", "Jawaban untuk keperluan pengujian end-to-end FAQ.");
    await page.getByRole("button", { name: "Tambah FAQ" }).click();
    await page.waitForURL(/\/admin\/faq$/);
    await expect(page.getByText(QUESTION)).toBeVisible();

    await page.goto("/kontak");
    // Pertanyaan yang baru ditambahkan tertutup secara default (hanya item
    // pertama Accordion yang terbuka) - cek judul pertanyaannya saja (selalu
    // tampil di tombol accordion terlepas dari status buka/tutup), pakai
    // .first() untuk berjaga-jaga dari artefak render ganda sesaat khas mode
    // dev Next.js saat navigasi sisi klien (sudah dikonfirmasi jinak).
    await expect(page.getByText(QUESTION).first()).toBeVisible();

    await page.goto("/admin/faq");
    await page.locator(".card").filter({ hasText: QUESTION }).getByLabel("Edit").click();
    await page.fill("#answer", "Jawaban yang sudah diedit untuk pengujian end-to-end FAQ.");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/faq$/);
    await expect(page.getByText("Jawaban yang sudah diedit untuk pengujian end-to-end FAQ.")).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page.locator(".card").filter({ hasText: QUESTION }).getByLabel("Hapus").click();
    await expect(page.getByText(QUESTION)).toHaveCount(0);
  });
});
