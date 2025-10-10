import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | WooVector",
    default: "WooVector - Ultra-Fast AI Chatbots for WooCommerce",
  },
  description:
    "Increase WooCommerce conversions 20-30% with sub-2-second AI chatbots. WooCommerce-specific product discovery, metadata enrichment, and intelligent recommendations.",
  keywords: [
    "WooCommerce AI chatbot",
    "WooCommerce product discovery",
    "WooCommerce conversions",
    "WooCommerce automation",
    "WooCommerce customer support",
    "WooCommerce AI assistant",
    "WooCommerce metadata enrichment",
    "WooCommerce product recommendations",
    "WooCommerce search optimization",
    "WooCommerce sales automation",
    "WordPress eCommerce AI",
    "WooCommerce chat widget",
    "WooCommerce customer experience",
    "WooCommerce revenue optimization",
  ],
  openGraph: {
    title: "WooVector - Ultra-Fast AI Chatbots for WooCommerce",
    description:
      "Increase WooCommerce conversions 20-30% with sub-2-second AI chatbots. WooCommerce-specific product discovery, metadata enrichment, and intelligent recommendations.",
    url: new URL(defaultUrl),
    siteName: "WooVector",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "WooVector - Ultra-fast AI chatbots for WooCommerce stores, featuring product discovery and intelligent recommendations.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WooVector - Ultra-Fast AI Chatbots for WooCommerce",
    description:
      "Increase WooCommerce conversions 20-30% with sub-2-second AI chatbots. WooCommerce-specific product discovery and intelligent recommendations.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const generateLegalMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `${title} | WooVector`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | WooVector`,
      description,
      type: "website",
    },
  };
};
