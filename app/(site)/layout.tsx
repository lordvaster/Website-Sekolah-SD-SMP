// Author: Zeday | https://join.co.id
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { siteConfig } from "@/lib/site-config";
import { readSettings } from "@/lib/settings";
import { getLocale } from "@/lib/i18n/get-locale";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { dictionaries } from "@/lib/i18n/dictionaries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, locale] = await Promise.all([readSettings(), getLocale()]);
  const dict = dictionaries[locale];
  const { siteTagline, schoolDescription, schoolAddress, schoolPhone, schoolEmail, schoolWhatsapp } =
    settings;

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
    <LocaleProvider locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkipToContent label={dict.common.skipToContent} />
      <Navbar tagline={siteTagline} />
      <main id="konten-utama">{children}</main>
      <Footer
        tagline={siteTagline}
        dict={dict}
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
      <FloatingWhatsApp whatsapp={schoolWhatsapp} />
    </LocaleProvider>
  );
}
