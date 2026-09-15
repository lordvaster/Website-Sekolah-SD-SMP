// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";
import { TOTP, Secret } from "otpauth";
import { E2E_ADMIN_PASSWORD } from "../../playwright.config";

// Dijalankan lewat sesi admin bersama (storageState) seperti spec lain, tapi
// SELALU menonaktifkan kembali 2FA di akhir - kalau tidak, spec berikutnya
// yang login lewat UI (mis. admin-access.spec.ts, kalau urutan file berubah)
// akan gagal karena tidak menyangka langkah kode 2FA.
test.describe("Verifikasi Dua Langkah (2FA) admin", () => {
  test("aktifkan 2FA, login pakai kode, lalu nonaktifkan lagi", async ({ page }) => {
    await page.goto("/admin/pengaturan");
    await expect(page.getByText("Belum aktif")).toBeVisible();

    await page.getByRole("button", { name: "Aktifkan 2FA" }).click();
    const secret = await page.locator("code.font-mono").innerText();

    const totp = new TOTP({ algorithm: "SHA1", digits: 6, period: 30, secret: Secret.fromBase32(secret) });

    await page.fill("#setup-code", totp.generate());
    await page.getByRole("button", { name: "Konfirmasi & Aktifkan" }).click();
    await expect(page.getByText("Aktif", { exact: true })).toBeVisible();

    // Simulasikan browser baru yang belum login sama sekali.
    await page.context().clearCookies();
    await page.goto("/admin");
    await page.fill("#password", E2E_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.getByRole("heading", { name: "Verifikasi Dua Langkah" })).toBeVisible();

    await page.fill("#code", totp.generate());
    await page.getByRole("button", { name: "Verifikasi" }).click();
    await expect(page).toHaveURL(/\/admin\/pengaturan$/);

    // Bersihkan: nonaktifkan lagi supaya spec lain yang login lewat UI tidak
    // ikut menyangka 2FA aktif.
    await page.getByRole("button", { name: "Nonaktifkan" }).click();
    await page.fill("#disable-code", totp.generate());
    await page.getByRole("button", { name: "Nonaktifkan" }).click();
    await expect(page.getByText("Belum aktif")).toBeVisible();
  });
});
