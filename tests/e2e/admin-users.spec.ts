// Author: Zeday | https://join.co.id
import { test, expect } from "@playwright/test";

test.describe("Manajemen pengguna & peran", () => {
  test("owner menambah editor, editor tidak bisa akses menu Pengguna, tercatat di Aktivitas", async ({
    page,
    browser,
  }) => {
    const USERNAME = `editor-e2e-${Date.now()}`;
    const PASSWORD = "password-editor-e2e-123";

    // Owner (sesi bersama dari auth.setup.ts) membuat akun editor baru.
    await page.goto("/admin/pengguna");
    await page.getByRole("button", { name: "Tambah Pengguna" }).click();
    await page.fill("#new-username", USERNAME);
    await page.fill("#new-name", "Editor Uji E2E");
    await page.fill("#new-password", PASSWORD);
    await page.selectOption("#new-role", "editor");
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText(USERNAME)).toBeVisible();

    // Login sebagai editor baru itu di context browser TERPISAH (bukan
    // storageState owner) untuk memastikan kredensialnya benar-benar
    // berfungsi sendiri, bukan kebetulan warisan sesi owner.
    const editorContext = await browser.newContext();
    const editorPage = await editorContext.newPage();
    try {
      await editorPage.goto("/admin");
      await editorPage.fill("#username", USERNAME);
      await editorPage.fill("#password", PASSWORD);
      await editorPage.getByRole("button", { name: "Masuk" }).click();
      await expect(editorPage).toHaveURL(/\/admin\/pengaturan$/);

      // Role "editor" tidak boleh melihat menu khusus owner...
      await expect(editorPage.getByRole("link", { name: "Pengguna" })).toHaveCount(0);
      await expect(editorPage.getByRole("link", { name: "Aktivitas" })).toHaveCount(0);

      // ...dan navigasi langsung ke URL-nya harus ditolak juga di server,
      // bukan cuma disembunyikan di UI.
      await editorPage.goto("/admin/pengguna");
      await expect(editorPage).toHaveURL(/\/admin\/pengaturan$/);
    } finally {
      await editorContext.close();
    }

    // Owner melihat login editor tadi tercatat di riwayat aktivitas.
    await page.goto("/admin/aktivitas");
    await expect(page.getByRole("cell", { name: USERNAME }).first()).toBeVisible();

    // Bersihkan: hapus akun uji supaya tidak menumpuk di database.
    await page.goto("/admin/pengguna");
    const row = page.locator("tr").filter({ hasText: USERNAME });
    page.once("dialog", (d) => d.accept());
    await row.getByLabel("Hapus").click();
    await expect(page.getByText(USERNAME)).toHaveCount(0);
  });
});
