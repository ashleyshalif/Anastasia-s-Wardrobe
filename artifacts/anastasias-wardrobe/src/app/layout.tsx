import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anastasia's Wardrobe",
  description:
    "Thoughtfully chosen styles for every age, every day and every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
