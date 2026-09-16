// Author: Zeday | https://join.co.id
import TestimonialForm from "@/components/admin/TestimonialForm";

export default function AdminNewTestimonialPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tambah Testimoni
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <TestimonialForm />
      </div>
    </div>
  );
}
