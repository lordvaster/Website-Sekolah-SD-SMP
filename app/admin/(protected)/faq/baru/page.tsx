// Author: Zeday | https://join.co.id
import FaqForm from "@/components/admin/FaqForm";

export default function AdminNewFaqPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Tambah FAQ</h1>
      <div className="mt-8 card p-6 sm:p-8">
        <FaqForm />
      </div>
    </div>
  );
}
