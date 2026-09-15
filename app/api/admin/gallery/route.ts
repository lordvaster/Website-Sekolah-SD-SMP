// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { galleryAdminSchema, randomHue } from "@/lib/admin-validation";
import { createGalleryItem, listGalleryItems } from "@/lib/repositories/gallery";
import { logActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listGalleryItems());
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = galleryAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const created = createGalleryItem({ ...parsed.data, hue: randomHue() });
  revalidatePath("/galeri");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "gallery.create",
    target: created.caption,
  });
  return NextResponse.json(created, { status: 201 });
}
