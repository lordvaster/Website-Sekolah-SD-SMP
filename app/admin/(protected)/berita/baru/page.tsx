// Author: Zeday | https://join.co.id
import NewsForm from "@/components/admin/NewsForm";

export default function AdminNewNewsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tulis Berita Baru
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <NewsForm />
      </div>
    </div>
  );
}
