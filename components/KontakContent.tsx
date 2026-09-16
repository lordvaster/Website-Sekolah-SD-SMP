// Author: Zeday | https://join.co.id
"use client";

import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import RegistrationForm from "@/components/RegistrationForm";
import Accordion from "@/components/Accordion";
import { useTranslation } from "@/lib/i18n/LocaleContext";
import type { SiteSettings } from "@/lib/settings";
import type { Program } from "@/lib/repositories/programs";
import type { Faq } from "@/lib/repositories/faqs";

type KontakSettings = Pick<
  SiteSettings,
  | "schoolAddress"
  | "schoolPhone"
  | "schoolEmail"
  | "operationalHours"
  | "socialInstagram"
  | "socialFacebook"
  | "socialYoutube"
  | "mapsEmbedSrc"
>;

export default function KontakContent({
  settings,
  programs,
  faqs,
}: {
  settings: KontakSettings;
  programs: Program[];
  faqs: Faq[];
}) {
  const { dict } = useTranslation();

  return (
    <>
      <Breadcrumb items={[{ label: dict.nav.contact }]} homeLabel={dict.breadcrumb.home} />

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.kontak.eyebrow}
            title={dict.kontak.title}
            description={dict.kontak.description}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <MapPin className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">{dict.kontak.address}</p>
              <p className="text-sm text-ink/70 dark:text-ink-dark/70">{settings.schoolAddress}</p>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Phone className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">{dict.kontak.phone}</p>
              <a href={`tel:${settings.schoolPhone.replace(/[^\d+]/g, "")}`} className="text-sm text-ink/70 dark:text-ink-dark/70">
                {settings.schoolPhone}
              </a>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Mail className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">{dict.kontak.email}</p>
              <a href={`mailto:${settings.schoolEmail}`} className="text-sm text-ink/70 dark:text-ink-dark/70">
                {settings.schoolEmail}
              </a>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Clock className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">{dict.kontak.hours}</p>
              <p className="text-sm text-ink/70 dark:text-ink-dark/70">{settings.operationalHours}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            {settings.socialInstagram && (
              <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.socialFacebook && (
              <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings.socialYoutube && (
              <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white dark:text-primary-light">
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="mt-10 overflow-hidden rounded-xl2 shadow-md">
            <iframe
              src={settings.mapsEmbedSrc}
              title="Lokasi SD Inovasi Ceria"
              loading="lazy"
              className="h-80 w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-14 dark:bg-primary/10 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
              {dict.kontak.sendMessageTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
              {dict.kontak.sendMessageDesc}
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div id="pendaftaran" className="card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
              {dict.kontak.registerTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
              {dict.kontak.registerDesc}
            </p>
            <div className="mt-6">
              <RegistrationForm programs={programs} />
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="container-page max-w-3xl">
            <SectionHeading eyebrow={dict.kontak.faqEyebrow} title={dict.kontak.faqTitle} />
            <div className="mt-10">
              <Accordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
