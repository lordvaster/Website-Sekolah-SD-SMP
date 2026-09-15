// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("Alur pendaftaran siswa baru", () => {
  test("pengunjung daftar, lalu admin melihat dan mengubah statusnya", async ({ page }) => {
    // Nama diberi akhiran unik supaya percobaan ulang (retry) tidak
    // bentrok dengan baris yang mungkin sudah tercipta dari percobaan
    // sebelumnya yang gagal di tengah jalan.
    const childName = `Anak Uji E2E ${Date.now()}`;

    await page.goto("/kontak");
    await page.fill("#childName", childName);
    await page.fill("#childAge", "7");
    await page.selectOption("#program", { index: 1 });
    await page.fill("#parentName", "Orang Tua Uji Otomatis E2E");
    await page.fill("#reg-email", "ortu-e2e@example.com");
    await page.fill("#reg-phone", "081234500000");
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    await expect(page.getByRole("status")).toContainText("Pendaftaran berhasil");

    // Cookie sesi admin sudah tersedia lewat storageState bersama
    // (lihat auth.setup.ts) - tidak perlu login ulang lewat UI di sini.
    await page.goto("/admin/pendaftaran");
    const row = page.getByRole("row", { name: new RegExp(childName) });
    await expect(row).toBeVisible();
    await expect(row.locator("select")).toHaveValue("baru");

    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/admin/registrations/") && r.request().method() === "PATCH"
      ),
      row.locator("select").selectOption("dihubungi"),
    ]);
    await page.reload();
    await expect(
      page.getByRole("row", { name: new RegExp(childName) }).locator("select")
    ).toHaveValue("dihubungi");
  });
});
