// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import KontakContent from "@/components/KontakContent";
import { readSettings } from "@/lib/settings";
import { listPrograms } from "@/lib/repositories/programs";
import { listFaqs } from "@/lib/repositories/faqs";

export const metadata: Metadata = {
  title: "Kontak & Pendaftaran",
  description:
    "Hubungi SD Inovasi Ceria atau daftarkan putra-putri anda sebagai siswa baru. Lihat lokasi, jam operasional, dan kontak resmi kami.",
};

export default async function KontakPage() {
  const programs = listPrograms();
  const faqs = listFaqs();
  const settings = await readSettings();

  return <KontakContent settings={settings} programs={programs} faqs={faqs} />;
}
