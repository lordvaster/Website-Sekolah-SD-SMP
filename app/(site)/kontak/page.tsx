// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import RegistrationForm from "@/components/RegistrationForm";
import Accordion from "@/components/Accordion";
import { faqs } from "@/lib/data";
import { readSettings } from "@/lib/settings";
import { listPrograms } from "@/lib/repositories/programs";

export const metadata: Metadata = {
  title: "Kontak & Pendaftaran",
  description:
    "Hubungi SD Inovasi Ceria atau daftarkan putra-putri anda sebagai siswa baru. Lihat lokasi, jam operasional, dan kontak resmi kami.",
};

export default async function KontakPage() {
  const programs = listPrograms();
  const settings = await readSettings();

  return (
    <>
      <Breadcrumb items={[{ label: "Kontak & Pendaftaran" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Hubungi Kami"
            title="Kontak & Informasi Sekolah"
            description="Kami siap membantu menjawab pertanyaan anda seputar sekolah dan proses pendaftaran."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <MapPin className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">Alamat</p>
              <p className="text-sm text-ink/70 dark:text-ink-dark/70">{settings.schoolAddress}</p>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Phone className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">Telepon</p>
              <a href={`tel:${settings.schoolPhone.replace(/[^\d+]/g, "")}`} className="text-sm text-ink/70 dark:text-ink-dark/70">
                {settings.schoolPhone}
              </a>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Mail className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">Email</p>
              <a href={`mailto:${settings.schoolEmail}`} className="text-sm text-ink/70 dark:text-ink-dark/70">
                {settings.schoolEmail}
              </a>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <Clock className="h-8 w-8 text-primary dark:text-primary-light" />
              <p className="font-heading font-bold text-ink dark:text-ink-dark">Jam Operasional</p>
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
              Kirim Pesan
            </h2>
            <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
              Ada pertanyaan seputar sekolah? Kirimkan pesan anda dan tim kami akan segera merespon.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div id="pendaftaran" className="card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
              Formulir Pendaftaran Siswa Baru
            </h2>
            <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
              Isi formulir berikut untuk mendaftarkan putra-putri anda. Anda akan menerima email konfirmasi setelah mendaftar.
            </p>
            <div className="mt-6">
              <RegistrationForm programs={programs} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Pertanyaan yang Sering Diajukan" />
          <div className="mt-10">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
