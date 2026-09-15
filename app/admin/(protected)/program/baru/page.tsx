// Author: Zeday | https://join.co.id
import ProgramForm from "@/components/admin/ProgramForm";

export default function AdminNewProgramPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tambah Program/Kelas
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <ProgramForm />
      </div>
    </div>
  );
}
