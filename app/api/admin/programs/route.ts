// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { programAdminSchema, randomHue, slugSchema } from "@/lib/admin-validation";
import { createProgram, listPrograms } from "@/lib/repositories/programs";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listPrograms());
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = programAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.name);

  try {
    const created = createProgram({
      slug,
      name: parsed.data.name,
      ageRange: parsed.data.ageRange,
      description: parsed.data.description,
      highlights: parsed.data.highlights,
      hue: randomHue(),
    });
    revalidatePath("/program");
    revalidatePath("/kontak");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Ada program lain dengan nama yang menghasilkan slug sama." },
        { status: 409 }
      );
    }
    console.error("[api/admin/programs] Gagal membuat program:", error);
    return NextResponse.json({ error: "Gagal menyimpan program." }, { status: 500 });
  }
}
