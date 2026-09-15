// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { galleryAdminSchema, randomHue } from "@/lib/admin-validation";
import { createGalleryItem, listGalleryItems } from "@/lib/repositories/gallery";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listGalleryItems());
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = galleryAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const created = createGalleryItem({ ...parsed.data, hue: randomHue() });
  revalidatePath("/galeri");
  return NextResponse.json(created, { status: 201 });
}
