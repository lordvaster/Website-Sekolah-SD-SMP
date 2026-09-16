// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { getTestimonialById } from "@/lib/repositories/testimonials";

export const dynamic = "force-dynamic";

export default async function AdminEditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = getTestimonialById(Number(id));
  if (!testimonial) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Edit Testimoni
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <TestimonialForm initial={testimonial} />
      </div>
    </div>
  );
}
