// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import RichTextContent from "@/components/RichTextContent";
import { siteConfig } from "@/lib/site-config";
import { readSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Bagaimana ${siteConfig.name} mengumpulkan, menggunakan, dan melindungi data pribadi yang anda berikan lewat website ini.`,
};

export default async function KebijakanPrivasiPage() {
  const settings = await readSettings();
  const content = settings.privacyPolicyContent
    .replaceAll("{{email}}", settings.schoolEmail)
    .replaceAll("{{phone}}", settings.schoolPhone)
    .replaceAll("{{schoolName}}", siteConfig.name);

  return (
    <>
      <Breadcrumb items={[{ label: "Kebijakan Privasi" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow="Privasi & Data Pribadi"
            title="Kebijakan Privasi"
            description={`Dokumen ini menjelaskan bagaimana ${siteConfig.name} mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi yang anda berikan lewat website ini, sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.`}
          />

          <div className="mt-10">
            <RichTextContent content={content} />
          </div>
        </div>
      </section>
    </>
  );
}
