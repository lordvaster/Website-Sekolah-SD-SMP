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
    // .first(): Navbar & Footer sempat sama-sama merender teks ini secara
    // transisi saat client-side navigation - keduanya valid, cukup salah satu.
    await page.goto("/");
    await expect(page.getByText(addressMarker).first()).toBeVisible();

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

  test("countdown pendaftaran tampil di beranda saat diisi, tersembunyi saat dikosongkan", async ({ page }) => {
    const before = await (await page.request.get("/api/settings")).json();

    const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    await page.goto("/admin/pengaturan");
    await page.fill("#registrationDeadline", future);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("Tersimpan")).toBeVisible();
    // Pastikan data sudah benar-benar tersimpan (lewat API, sumber kebenaran
    // langsung) sebelum memeriksa render-nya di halaman publik - memisahkan
    // "apakah tersimpan" dari "apakah tampil", supaya jika salah satu gagal
    // pesan errornya jelas menunjuk ke penyebab yang tepat.
    await expect
      .poll(async () => (await (await page.request.get("/api/settings")).json()).registrationDeadline, {
        timeout: 10000,
      })
      .toBe(future);

    // CountdownTimer sengaja mulai dari null (server & client render sama-
    // sama kosong dulu) baru terisi lewat efek client-side setelah hydrasi
    // selesai - lihat components/CountdownTimer.tsx. toPass menavigasi ulang
    // ("/" fresh) tiap percobaan, bukan cuma menunggu di halaman yang sama.
    await expect(async () => {
      await page.goto("/");
      await expect(page.getByText("Pendaftaran ditutup dalam")).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 20000 });
    // exact: true - tanpa ini "Hari" (substring, case-insensitive default
    // Playwright) juga cocok dengan kata "hari" di tengah kutipan testimoni
    // dummy ("...berangkat sekolah setiap hari...") di section lain beranda.
    await expect(page.getByText("Hari", { exact: true })).toBeVisible();

    await page.goto("/admin/pengaturan");
    await page.fill("#registrationDeadline", "");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("Tersimpan")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText("Pendaftaran ditutup dalam")).toHaveCount(0);

    // Kembalikan ke nilai semula (jaga-jaga bukan string kosong di produksi nyata).
    await page.goto("/admin/pengaturan");
    await page.fill("#registrationDeadline", before.registrationDeadline ?? "");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("Tersimpan")).toBeVisible();
  });
});
