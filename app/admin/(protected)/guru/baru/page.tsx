// Author: Zeday | https://join.co.id
import TeacherForm from "@/components/admin/TeacherForm";

export default function AdminNewTeacherPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tambah Profil Guru
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <TeacherForm />
      </div>
    </div>
  );
}
