// Author: Zeday | https://join.co.id
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { siteConfig } from "@/lib/site-config";
import { readSettings } from "@/lib/settings";

export default async function SiteLayout({
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkipToContent />
      <Navbar tagline={siteTagline} />
      <main id="konten-utama">{children}</main>
      <Footer tagline={siteTagline} />
    </>
  );
}
