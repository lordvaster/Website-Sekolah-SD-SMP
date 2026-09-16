// Author: Zeday | https://join.co.id
"use client";

import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import RichTextContent from "@/components/RichTextContent";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function PrivacyPolicyContent({
  content,
  schoolName,
}: {
  content: string;
  schoolName: string;
}) {
  const { dict } = useTranslation();
  // Konten Kebijakan Privasi ditulis admin (bisa dalam bahasa apa pun) dan
  // SENGAJA tidak ikut diterjemahkan otomatis - hanya teks pembungkus di
  // halaman ini (judul/deskripsi) yang mengikuti bahasa UI yang dipilih.
  const description = dict.privacy.description.replaceAll("{{schoolName}}", schoolName);

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
