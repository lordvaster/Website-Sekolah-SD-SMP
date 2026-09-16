// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import RichTextContent from "@/components/RichTextContent";
import { siteConfig } from "@/lib/site-config";
import { readSettings } from "@/lib/settings";
import { getDictionary } from "@/lib/i18n/get-locale";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Bagaimana ${siteConfig.name} mengumpulkan, menggunakan, dan melindungi data pribadi yang anda berikan lewat website ini.`,
};

export default async function KebijakanPrivasiPage() {
  const [settings, dict] = await Promise.all([readSettings(), getDictionary()]);
  // Konten Kebijakan Privasi ditulis admin (bisa dalam bahasa apa pun) dan
  // SENGAJA tidak ikut diterjemahkan otomatis - hanya teks pembungkus di
  // halaman ini (judul/deskripsi) yang mengikuti bahasa UI yang dipilih.
  const content = settings.privacyPolicyContent
    .replaceAll("{{email}}", settings.schoolEmail)
    .replaceAll("{{phone}}", settings.schoolPhone)
    .replaceAll("{{schoolName}}", siteConfig.name);
  const description = dict.privacy.description.replaceAll("{{schoolName}}", siteConfig.name);

  return (
    <>
      <Breadcrumb items={[{ label: dict.privacy.title }]} homeLabel={dict.breadcrumb.home} />

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow={dict.privacy.eyebrow} title={dict.privacy.title} description={description} />

          <div className="mt-10">
            <RichTextContent content={content} />
          </div>
        </div>
      </section>
    </>
  );
}
