// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

// Test ini pakai context browser baru (bukan storageState admin), jadi
// cookie locale yang diset di sini tidak bocor ke spec lain.
test.describe("Pilihan bahasa (UI)", () => {
  test("ganti bahasa menerjemahkan UI tapi tidak menyentuh konten admin, dan bertahan lintas halaman", async ({ page }) => {
    await page.goto("/");
    // "Beranda" muncul di Navbar DAN Footer sekaligus di halaman ini.
    await expect(page.getByRole("link", { name: "Beranda", exact: true }).first()).toBeVisible();

    // Tagline adalah konten yang ditulis admin (lewat Pengaturan) -
    // dipakai sebagai judul utama Hero, HARUS tetap Bahasa Indonesia
    // apa pun bahasa UI yang dipilih.
    const tagline = "Belajar Seru, Tumbuh Percaya Diri";
    await expect(page.getByRole("heading", { name: tagline, level: 1 })).toBeVisible();

    await page.selectOption("#language-switcher", "en");
    await expect(page.getByRole("link", { name: "Home", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Enroll Now" }).first()).toBeVisible();

    // Konten admin (tagline) tidak ikut berubah walau UI sudah Inggris.
    await expect(page.getByRole("heading", { name: tagline, level: 1 })).toBeVisible();

    // Pilihan bahasa bertahan lewat cookie, bukan cuma state client -
    // navigasi penuh ke halaman lain harus tetap Inggris.
    await page.goto("/kontak");
    await expect(page.getByRole("heading", { name: "Contact & School Information" })).toBeVisible();
    await expect(page.getByText("Address").first()).toBeVisible();

    // Footer (semua halaman) juga ikut berubah - halaman ini juga punya
    // link "Privacy Policy" lain di catatan persetujuan form pendaftaran,
    // jadi scope ke landmark footer ("contentinfo") secara eksplisit.
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  });

  test("Bahasa Jepang dan Mandarin juga tersedia", async ({ page }) => {
    await page.goto("/");

    await page.selectOption("#language-switcher", "ja");
    await expect(page.getByRole("link", { name: "ホーム", exact: true }).first()).toBeVisible();

    await page.selectOption("#language-switcher", "zh");
    await expect(page.getByRole("link", { name: "首页", exact: true }).first()).toBeVisible();
  });
});
