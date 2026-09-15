// Author: Zeday | https://join.co.id
import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import Analytics from "@/components/Analytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { siteConfig } from "@/lib/site-config";
import { readSettings } from "@/lib/settings";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

// Halaman lain tetap dirender statis untuk performa, tapi disegarkan ulang
// otomatis di background setiap 60 detik (ISR) - tanpa ini, tagline yang
// diubah admin di /admin/pengaturan tidak akan pernah muncul di <title>/OG
// dan navbar/footer sampai proyek di-build ulang, karena root layout ikut
// dirender sekali saja saat build.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { siteTagline } = await readSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteTagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "SD Inovasi Ceria",
      "sekolah dasar Palangkaraya",
      "sekolah anak ceria",
      "pendaftaran siswa baru",
      "sekolah ramah anak",
    ],
    authors: [{ name: siteConfig.developer.name, url: siteConfig.developer.url }],
    creator: siteConfig.developer.name,
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteTagline}`,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteTagline}`,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4A90E2" },
    { media: "(prefers-color-scheme: dark)", color: "#151A21" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteTagline } = await readSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "ID",
    },
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <html lang="id" suppressHydrationWarning className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <SkipToContent />
          <Navbar tagline={siteTagline} />
          <main id="konten-utama">{children}</main>
          <Footer tagline={siteTagline} />
        </ThemeProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
