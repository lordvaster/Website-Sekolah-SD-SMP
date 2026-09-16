// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("CRUD Video", () => {
  test("tambah video (dari URL YouTube), tampil di Galeri, edit, lalu hapus", async ({ page }) => {
    const TITLE = `Video Uji E2E ${Date.now()}`;

    await page.goto("/admin/video/baru");
    await page.fill("#title", TITLE);
    // Sengaja pakai URL lengkap (bukan ID mentah) untuk menguji parsing
    // berbagai format URL YouTube di lib/admin-validation.ts.
    await page.fill("#youtubeId", "https://youtu.be/aqz-KE-bpKQ?si=abc123");
    await page.selectOption("#category", "Virtual Tour");
    await page.getByRole("button", { name: "Tambah Video" }).click();
    await page.waitForURL(/\/admin\/video$/);
    await expect(page.getByText(TITLE)).toBeVisible();

    await page.goto("/galeri");
    // .first(): artefak render ganda sesaat khas mode dev Next.js saat
    // navigasi sisi klien (sudah dikonfirmasi jinak berkali-kali di test
    // lain proyek ini) - keduanya identik, cukup periksa salah satu.
    const iframe = page.locator(`iframe[title="${TITLE}"]`).first();
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/aqz-KE-bpKQ");

    await page.goto("/admin/video");
    await page.locator(".card").filter({ hasText: TITLE }).getByLabel("Edit").click();
    await page.fill("#title", `${TITLE} (Diedit)`);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.waitForURL(/\/admin\/video$/);
    await expect(page.getByText(`${TITLE} (Diedit)`)).toBeVisible();

    page.once("dialog", (d) => d.accept());
    await page
      .locator(".card")
      .filter({ hasText: `${TITLE} (Diedit)` })
      .getByLabel("Hapus")
      .click();
    await expect(page.getByText(`${TITLE} (Diedit)`)).toHaveCount(0);
  });
});
