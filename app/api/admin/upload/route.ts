// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/require-admin";
import { rateLimitGuard } from "@/lib/rate-limit";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_FOLDERS = new Set(["news", "gallery", "teachers", "testimonials", "achievements"]);

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const limited = rateLimitGuard(request, "admin-upload");
  if (limited) return limited;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const folder = form?.get("folder");

  if (!(file instanceof File) || typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Berkas atau folder tidak valid." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 5MB." },
      { status: 400 }
    );
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return NextResponse.json({ path: `/uploads/${folder}/${fileName}` });
}
