import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreProvider } from "@/lib/store";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  metadataBase: new URL("https://rynaswardrobe.com"),
  title: {
    default: `${brandConfig.name} | Thoughtfully Chosen Styles`,
    template: `%s | ${brandConfig.name}`,
  },
  description:
    "Thoughtfully chosen styles for every age, every day and every occasion. Curated clothing for Girls 2–12, Teens 13–17, and Women.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Ryna's Wardrobe",
    description:
      "Thoughtfully chosen styles for every age, every day and every occasion.",
    url: "https://rynaswardrobe.com",
    siteName: "Ryna's Wardrobe",
    images: [
      {
        url: "/images/logo.png",
        width: 1024,
        height: 768,
        alt: "Ryna's Wardrobe Official Crest",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#302B28] antialiased overflow-x-hidden" suppressHydrationWarning>
        <StoreProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
