// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("Situs publik", () => {
  test("beranda tampil tanpa error console", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Belajar Seru/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("dark mode toggle mengubah tema", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: /mode gelap/i }).click();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("button", { name: /mode terang/i }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("menu mobile bisa dibuka", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Buka menu" }).click();
    await expect(
      page.locator("#mobile-menu").getByRole("link", { name: "Program & Kelas" })
    ).toBeVisible();
  });

  test("tidak ada horizontal scroll di layar sempit (390px)", async ({ page }) => {
    // Regresi nyata yang pernah lolos: tombol "Daftar Sekarang" versi desktop
    // (className "hidden sm:inline-flex") tetap tampil di layar sempit
    // karena .btn-primary didefinisikan di luar @layer components (lihat
    // app/globals.css) sehingga menang urutan sumber melawan utility
    // "hidden" - navbar jadi meluber begitu ditambah kontrol lain (mis.
    // pemilih bahasa).
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/tentang", "/program", "/galeri", "/berita", "/kontak"]) {
      await page.goto(path);
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasOverflow, `${path} punya horizontal scroll di layar 390px`).toBe(false);
    }
  });

  test("form kontak menampilkan validasi saat dikosongkan", async ({ page }) => {
    await page.goto("/kontak");
    await page.getByRole("button", { name: "Kirim Pesan" }).click();
    await expect(page.getByText("Nama minimal 2 karakter")).toBeVisible();
    await expect(page.getByText("Pesan minimal 10 karakter")).toBeVisible();
  });

  test("halaman berita, galeri, program, dan tentang bisa diakses", async ({ page }) => {
    for (const path of ["/berita", "/galeri", "/program", "/tentang"]) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    }
  });
});
