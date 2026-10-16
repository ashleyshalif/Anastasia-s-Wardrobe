import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreProvider } from "@/lib/store";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anastasiaswardrobe.com"),
  title: {
    default: "Anastasia's Wardrobe | Thoughtfully Chosen Styles",
    template: "%s | Anastasia's Wardrobe",
  },
  description:
    "Thoughtfully chosen styles for every age, every day and every occasion. Curated clothing for Girls 2–12, Teens 13–17, and Women.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Anastasia's Wardrobe",
    description:
      "Thoughtfully chosen styles for every age, every day and every occasion.",
    url: "https://anastasiaswardrobe.com",
    siteName: "Anastasia's Wardrobe",
    images: [
      {
        url: "/images/logo.png",
        width: 1024,
        height: 768,
        alt: "Anastasia's Wardrobe Official Crest",
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
    <html lang="en" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
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
