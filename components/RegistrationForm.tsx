// Author: Zeday | https://join.co.id
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { registrationSchema, type RegistrationInput } from "@/lib/validation";
import type { Program } from "@/lib/repositories/programs";
import { useFormSubmit } from "@/lib/hooks/useFormSubmit";

export default function RegistrationForm({ programs }: { programs: Program[] }) {
  const { status, errorMessage, submit } = useFormSubmit<RegistrationInput>("/api/pendaftaran");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegistrationInput) => {
    const ok = await submit(data);
    if (ok) reset();
  };

  if (programs.length === 0) {
    return (
      <p className="rounded-lg bg-accent/10 p-4 text-sm text-ink/80 dark:text-ink-dark/80">
        Menu pendaftaran online belum tersedia saat ini. Silakan hubungi kami langsung lewat
        formulir kontak atau kontak di atas untuk mendaftarkan putra-putri anda.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="childName" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Nama Anak
          </label>
          <input
            id="childName"
            type="text"
            aria-invalid={!!errors.childName}
            aria-describedby={errors.childName ? "childName-error" : undefined}
            {...register("childName")}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
          {errors.childName && (
            <p id="childName-error" role="alert" className="mt-1 text-sm text-cta">{errors.childName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="childAge" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Usia Anak
          </label>
          <input
            id="childAge"
            type="number"
            min={3}
            max={13}
            aria-invalid={!!errors.childAge}
            aria-describedby={errors.childAge ? "childAge-error" : undefined}
            {...register("childAge")}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
          {errors.childAge && (
            <p id="childAge-error" role="alert" className="mt-1 text-sm text-cta">{errors.childAge.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="program" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Jenjang yang Dituju
        </label>
        <select
          id="program"
          defaultValue=""
          aria-invalid={!!errors.program}
          aria-describedby={errors.program ? "program-error" : undefined}
          {...register("program")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        >
          <option value="" disabled>
            Pilih jenjang
          </option>
          {programs.map((p) => (
            <option key={p.slug} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.program && (
          <p id="program-error" role="alert" className="mt-1 text-sm text-cta">{errors.program.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="parentName" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nama Orang Tua/Wali
        </label>
        <input
          id="parentName"
          type="text"
          aria-invalid={!!errors.parentName}
          aria-describedby={errors.parentName ? "parentName-error" : undefined}
          {...register("parentName")}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
        {errors.parentName && (
          <p id="parentName-error" role="alert" className="mt-1 text-sm text-cta">{errors.parentName.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-email" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "reg-email-error" : undefined}
            {...register("email")}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
          {errors.email && (
            <p id="reg-email-error" role="alert" className="mt-1 text-sm text-cta">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="reg-phone" className="block text-sm font-semibold text-ink dark:text-ink-dark">
            Nomor Telepon
          </label>
          <input
            id="reg-phone"
            type="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "reg-phone-error" : undefined}
            {...register("phone")}
            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
          {errors.phone && (
            <p id="reg-phone-error" role="alert" className="mt-1 text-sm text-cta">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-ink/60 dark:text-ink-dark/60">
        Dengan mendaftar, anda menyetujui{" "}
        <Link href="/kebijakan-privasi" className="text-primary underline hover:no-underline dark:text-primary-light">
          Kebijakan Privasi
        </Link>{" "}
        kami mengenai data yang anda berikan di sini.
      </p>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-70">
        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
        {isSubmitting ? "Mengirim..." : "Daftar Sekarang"}
      </button>

      {status === "success" && (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-secondary-dark dark:text-secondary-light">
          <CheckCircle2 className="h-5 w-5" /> Pendaftaran berhasil! Cek email anda untuk konfirmasi.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-5 w-5" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
