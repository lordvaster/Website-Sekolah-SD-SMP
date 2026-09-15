// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { randomHue, slugSchema, teacherAdminSchema } from "@/lib/admin-validation";
import { createTeacher, listTeachers } from "@/lib/repositories/teachers";
import { logActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listTeachers());
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = teacherAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.name);

  try {
    const created = createTeacher({ ...parsed.data, slug, hue: randomHue() });
    revalidatePath("/tentang");
    logActivity({
      userId: auth.user.id,
      username: auth.user.username,
      action: "teacher.create",
      target: created.name,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Ada guru lain dengan nama yang menghasilkan slug sama. Ubah sedikit namanya." },
        { status: 409 }
      );
    }
    console.error("[api/admin/teachers] Gagal membuat profil guru:", error);
    return NextResponse.json({ error: "Gagal menyimpan profil guru." }, { status: 500 });
  }
}
