// Author: Zeday | https://join.co.id
"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleContext";
import CountdownTimer from "./CountdownTimer";

export default function CTASection({
  whatsapp,
  registrationDeadline,
}: {
  whatsapp: string;
  registrationDeadline: string;
}) {
  const { dict } = useTranslation();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="overflow-hidden rounded-xl2 bg-gradient-to-br from-primary to-secondary px-6 py-14 text-center text-white shadow-lg sm:px-14">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            {dict.cta.subtitle}
          </p>
          {registrationDeadline && <CountdownTimer deadline={registrationDeadline} />}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/kontak"
              className="btn bg-white text-primary hover:bg-white/90"
            >
              {dict.cta.ctaRegister}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/20"
            >
              {dict.cta.ctaWhatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
