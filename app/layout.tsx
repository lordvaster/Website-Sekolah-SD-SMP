// Author: Zeday | https://join.co.id
import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
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

// Halaman publik tetap dirender statis untuk performa, tapi disegarkan
// ulang otomatis di background setiap 60 detik (ISR) - tanpa ini, tagline
// yang diubah admin di /admin/pengaturan tidak akan pernah muncul di
// <title>/OG sampai proyek di-build ulang. Halaman admin sendiri sudah
// memaksa force-dynamic satu per satu, yang otomatis menimpa nilai ini.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { siteTagline, schoolDescription } = await readSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteTagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: schoolDescription,
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
      description: schoolDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteTagline}`,
      description: schoolDescription,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
