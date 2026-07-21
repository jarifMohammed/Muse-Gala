import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";
import AuthSessionProvider from "@/providers/AuthSessionProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const avenir = localFont({
  src: "./fonts/avenir/Avenir Regular.ttf",
  variable: "--font-avenir",
  weight: "100 900",
  display: "swap",
});

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://musegala.com.au"),
  title: {
    default: "Muse Gala | Discover Dress Hire Near You",
    template: "%s | Muse Gala"
  },
  description:
    "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
  keywords: [
    "designer dress hire Australia",
    "dress hire near me",
    "Bec and Bridge dress hire",
    "Oh Polly dress hire",
    "Arcina Ori dress hire",
    "LIDÉE dress hire",
    "formal dress hire",
    "party dress hire",
    "event dress hire",
    "last minute dress hire",
  ],
  authors: [{ name: "Muse Gala" }],
  icons: {
    icon: [
      { url: "/M.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/M.ico",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Muse Gala | Discover Dress Hire Near You",
    description:
      "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
    url: "https://musegala.com.au",
    siteName: "Muse Gala",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Muse Gala Designer Dress Hire",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muse Gala | Discover Dress Hire Near You",
    description:
      "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
    images: ["/logo.svg"],
    creator: "@MuseGala",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Muse Gala",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", avenir.className)}>
        <AuthSessionProvider>
          <AppProvider>
            {children}
            {/* <Footer /> */}
            <Toaster />
          </AppProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
