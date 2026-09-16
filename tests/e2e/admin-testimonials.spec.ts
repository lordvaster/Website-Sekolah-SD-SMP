// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD Testimoni", () => {
  test("tambah testimoni, tampil di beranda, edit, lalu hapus", async ({ page }) => {
    const NAME = `Wali Murid Uji E2E ${Date.now()}`;

    await page.goto("/admin/testimoni/baru");
    await page.fill("#name", NAME);
    await page.fill("#role", "Orang Tua Siswa");
    await page.fill("#quote", "Kutipan testimoni untuk keperluan pengujian end-to-end.");
    await page.getByRole("button", { name: "Tambah Testimoni" }).click();
    await page.waitForURL(/\/admin\/testimoni$/);
    await expect(page.getByText(NAME)).toBeVisible();

    await page.goto("/");
    // Testimoni baru ditambahkan di akhir daftar (id ASC) - klik tombol dot
    // terakhir supaya testimoni yang baru dibuat tampil, tanpa bergantung
    // pada interval otomatis carousel yang berjalan setiap 6 detik.
    const dots = page.locator('button[aria-label^="Tampilkan testimoni"]');
    await dots.last().click();
    await expect(page.getByText(NAME)).toBeVisible();

    await page.goto("/admin/testimoni");
    await page.locator(".card").filter({ hasText: NAME }).getByLabel("Edit").click();
    await page.fill("#role", "Orang Tua Siswa (Diedit)");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/testimoni$/);
    await expect(page.getByText("Orang Tua Siswa (Diedit)")).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page.locator(".card").filter({ hasText: NAME }).getByLabel("Hapus").click();
    await expect(page.getByText(NAME)).toHaveCount(0);
  });
});
