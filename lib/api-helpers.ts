// Author: Zeday | https://join.co.id
// Bentuk respons yang dipakai bersama oleh route handler form (contact &
// pendaftaran) agar kontrak API-nya konsisten dan tidak diduplikasi.
import { NextResponse } from "next/server";
import type { z } from "zod";

export function validationErrorResponse(error: z.ZodError) {
  return NextResponse.json(
    { error: "Data tidak valid.", issues: error.flatten().fieldErrors },
    { status: 400 }
  );
}

export function emailNotConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "Permintaan tidak dapat diproses karena server email belum dikonfigurasi. Silakan hubungi kami via telepon/WhatsApp.",
    },
    { status: 503 }
  );
}
