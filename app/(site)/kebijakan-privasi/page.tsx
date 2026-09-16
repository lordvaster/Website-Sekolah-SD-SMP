// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
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

  return <PrivacyPolicyContent content={content} schoolName={siteConfig.name} />;
}
