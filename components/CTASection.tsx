// Author: Zeday | https://join.co.id
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function CTASection({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="overflow-hidden rounded-xl2 bg-gradient-to-br from-primary to-secondary px-6 py-14 text-center text-white shadow-lg sm:px-14">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Siap Bergabung dengan Keluarga Besar {siteConfig.shortName}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Kuota pendaftaran tahun ajaran baru terbatas. Hubungi kami sekarang
            untuk informasi lebih lanjut dan jadwal kunjungan sekolah.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/kontak"
              className="btn bg-white text-primary hover:bg-white/90"
            >
              Daftar Sekarang
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/20"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
