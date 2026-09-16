// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { randomHue, testimonialAdminSchema } from "@/lib/admin-validation";
import { createTestimonial, listTestimonials } from "@/lib/repositories/testimonials";
import { logActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listTestimonials());
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = testimonialAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const created = createTestimonial({ ...parsed.data, hue: randomHue() });
  revalidatePath("/", "layout");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "testimonial.create",
    target: created.name,
  });
  return NextResponse.json(created, { status: 201 });
}
