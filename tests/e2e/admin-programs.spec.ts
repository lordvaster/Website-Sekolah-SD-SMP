// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD Program", () => {
  test("tambah program, tampil di publik, edit, lalu hapus", async ({ page }) => {
    const NAME = `Kelas Uji E2E ${Date.now()}`;

    await page.goto("/admin/program/baru");
    await page.fill("#name", NAME);
    await page.fill("#ageRange", "9-10 tahun");
    await page.fill("#description", "Deskripsi program untuk keperluan pengujian end-to-end.");
    await page.fill("#highlights", "Poin satu\nPoin dua");
    await page.getByRole("button", { name: "Tambah Program" }).click();
    await page.waitForURL(/\/admin\/program$/);
    await expect(page.getByRole("cell", { name: NAME })).toBeVisible();

    await page.goto("/program");
    await expect(page.getByRole("heading", { name: NAME })).toBeVisible();

    await page.goto("/admin/program");
    await page
      .getByRole("row", { name: new RegExp(NAME) })
      .getByLabel("Edit")
      .click();
    await page.fill("#ageRange", "10-11 tahun");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/program$/);

    page.once("dialog", (d) => d.accept());
    await page
      .getByRole("row", { name: new RegExp(NAME) })
      .getByLabel("Hapus")
      .click();
    await expect(page.getByRole("cell", { name: NAME })).toHaveCount(0);
  });
});
