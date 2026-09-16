// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import FaqForm from "@/components/admin/FaqForm";
import { getFaqById } from "@/lib/repositories/faqs";

export const dynamic = "force-dynamic";

export default async function AdminEditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = getFaqById(Number(id));
  if (!faq) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Edit FAQ</h1>
      <div className="mt-8 card p-6 sm:p-8">
        <FaqForm initial={faq} />
      </div>
    </div>
  );
}
