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
  const settings = await readSettings();
  const { siteTagline, schoolDescription, schoolAddress, schoolPhone, schoolEmail } = settings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: siteConfig.name,
    description: schoolDescription,
    url: siteConfig.url,
    telephone: schoolPhone,
    email: schoolEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: schoolAddress,
      addressCountry: "ID",
    },
    sameAs: [settings.socialInstagram, settings.socialFacebook, settings.socialYoutube].filter(Boolean),
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
      <Footer
        tagline={siteTagline}
        info={{
          schoolDescription,
          schoolAddress,
          schoolPhone,
          schoolEmail,
          socialInstagram: settings.socialInstagram,
          socialFacebook: settings.socialFacebook,
          socialYoutube: settings.socialYoutube,
        }}
      />
    </>
  );
}
