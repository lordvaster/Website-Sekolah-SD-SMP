// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal mengirim");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nama Lengkap
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-cta">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-cta">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nomor Telepon
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        {errors.phone && (
          <p id="phone-error" role="alert" className="mt-1 text-sm text-cta">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Pesan
        </label>
        <textarea
          id="message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-sm text-cta">
            {errors.message.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-70">
        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
        {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
      </button>

      {status === "success" && (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-secondary-dark dark:text-secondary-light">
          <CheckCircle2 className="h-5 w-5" /> Pesan berhasil dikirim, terima kasih!
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-5 w-5" /> Terjadi kesalahan, silakan coba lagi.
        </p>
      )}
    </form>
  );
}
