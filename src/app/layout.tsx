import type { Metadata } from "next";
import { LanguageProvider } from "@/i18n/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "NimiPiko - Coming Soon",
  description:
    "Something amazing is coming soon! Nimi and Piko are working hard to bring you a magical learning adventure.",
  icons: {
    icon: "/nimi-logo.png",
    apple: "/nimi-logo.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="variable-fredoka font-nunito">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
