import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kmagency.online"),
  title: {
    default: "KM Agency | Digital Marketing, Branding, Web Development & AI Automation",
    template: "%s | KM Agency"
  },
  description: "KM Agency provides professional digital marketing, full branding, website development, campaign management, video editing, SEO, and AI automation services in Arabic and English.",
  keywords: [
    "KM Agency",
    "digital marketing agency",
    "marketing agency Jordan",
    "branding agency",
    "website development",
    "landing page design",
    "campaign management",
    "social media management",
    "SEO services",
    "video editing",
    "AI automation",
    "وكالة تسويق رقمي",
    "تصميم هوية تجارية",
    "تطوير مواقع"
  ],
  alternates: {
    canonical: "/",
    languages: {
      ar: "/ar",
      en: "/en"
    }
  },
  openGraph: {
    title: "KM Agency | Digital Growth Services",
    description: "Websites, branding, campaigns, content, SEO, video, and automation for growing businesses.",
    url: "/",
    siteName: "KM Agency",
    images: [{ url: "/km-logo.png", width: 512, height: 512, alt: "KM Agency logo" }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "KM Agency",
    description: "Digital marketing, branding, websites, campaigns, SEO, video, and automation.",
    images: ["/km-logo.png"]
  },
  icons: {
    icon: "/km-logo.png",
    shortcut: "/km-logo.png",
    apple: "/km-logo.png"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "KM Agency",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kmagency.online",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kmagency.online"}/km-logo.png`,
    email: "sales@kmagency.online",
    telephone: "+962777066779",
    areaServed: ["Jordan", "Middle East", "Worldwide"],
    sameAs: ["https://wa.me/962777066779"],
    serviceType: [
      "Digital Marketing",
      "Branding",
      "Website Development",
      "Campaign Management",
      "SEO",
      "Social Media Management",
      "Video Editing",
      "AI Business Automation"
    ],
    availableLanguage: ["Arabic", "English"]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
