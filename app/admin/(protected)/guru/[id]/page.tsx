// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import TeacherForm from "@/components/admin/TeacherForm";
import { getTeacherById } from "@/lib/repositories/teachers";

export const dynamic = "force-dynamic";

export default async function AdminEditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = getTeacherById(Number(id));
  if (!teacher) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Edit Profil Guru
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <TeacherForm initial={teacher} />
      </div>
    </div>
  );
}
