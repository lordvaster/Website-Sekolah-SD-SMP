// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { updateUserSchema } from "@/lib/admin-validation";
import {
  countActiveOwners,
  deleteAdminUser,
  getAdminUserById,
  toSummary,
  updateAdminUser,
} from "@/lib/repositories/admin-users";
import { logActivity } from "@/lib/repositories/activity-log";

// Mencegah owner aktif terakhir kehilangan akses (dihapus, dinonaktifkan,
// atau diturunkan perannya) - kalau lolos, tidak ada lagi akun yang bisa
// mengelola pengguna sama sekali dan situs butuh akses server langsung
// untuk pulih.
function wouldRemoveLastOwner(id: number, becomingOwnerAndActive: boolean) {
  if (becomingOwnerAndActive) return false;
  return countActiveOwners(id) === 0;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getAdminUserById(id);
  if (!existing) return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  if (existing.role === "owner" && existing.active) {
    const becoming = parsed.data.role === "owner" && parsed.data.active;
    if (wouldRemoveLastOwner(id, becoming)) {
      return NextResponse.json(
        { error: "Tidak bisa menonaktifkan/menurunkan peran owner aktif terakhir." },
        { status: 400 }
      );
    }
  }

  const updated = updateAdminUser(id, parsed.data);
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "user.update",
    target: updated?.username,
  });
  return NextResponse.json(updated ? toSummary(updated) : null);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (id === auth.user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
  }

  const existing = getAdminUserById(id);
  if (!existing) return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });

  if (existing.role === "owner" && existing.active && wouldRemoveLastOwner(id, false)) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus owner aktif terakhir." },
      { status: 400 }
    );
  }

  deleteAdminUser(id);
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "user.delete",
    target: existing.username,
  });
  return NextResponse.json({ ok: true });
}
