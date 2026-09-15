// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";
import { getNewsById } from "@/lib/repositories/news";

export const dynamic = "force-dynamic";

export default async function AdminEditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getNewsById(Number(id));
  if (!article) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Edit Berita
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <NewsForm initial={article} />
      </div>
    </div>
  );
}
