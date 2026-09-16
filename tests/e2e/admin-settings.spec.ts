// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("Pengaturan situs (kontak & kebijakan privasi)", () => {
  test("admin edit alamat & kebijakan privasi, tampil di halaman publik", async ({ page }) => {
    // Simpan nilai awal supaya bisa dikembalikan lagi di akhir test - ini
    // pengaturan global bersama (bukan baris yang bisa dihapus seperti
    // berita/guru/dll), jadi harus dipulihkan manual.
    const before = await (await page.request.get("/api/settings")).json();

    const addressMarker = `Alamat Uji E2E ${Date.now()}`;
    const privacyMarker = `## Bagian Uji E2E\n\nIsi kebijakan privasi versi uji ${Date.now()}, kontak: {{email}}.`;

    await page.goto("/admin/pengaturan");
    await page.fill("#schoolAddress", addressMarker);
    await page.fill("#privacyPolicyContent", privacyMarker);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("Tersimpan")).toBeVisible();

    // Muncul di footer (semua halaman) dan kartu alamat di halaman Kontak.
    await page.goto("/");
    await expect(page.getByText(addressMarker)).toBeVisible();

    await page.goto("/kontak");
    // Muncul dua kali di halaman ini (kartu Alamat + footer) - cukup
    // pastikan salah satunya terlihat.
    await expect(page.getByText(addressMarker).first()).toBeVisible();

    // Kebijakan Privasi merender heading "## " dan mengganti {{email}}.
    await page.goto("/kebijakan-privasi");
    await expect(page.getByRole("heading", { name: "Bagian Uji E2E" })).toBeVisible();
    await expect(page.getByText(`kontak: ${before.schoolEmail}.`)).toBeVisible();

    // Kembalikan ke nilai semula.
    await page.goto("/admin/pengaturan");
    await page.fill("#schoolAddress", before.schoolAddress);
    await page.fill("#privacyPolicyContent", before.privacyPolicyContent);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("Tersimpan")).toBeVisible();
  });
});
