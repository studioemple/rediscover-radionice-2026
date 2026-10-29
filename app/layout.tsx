import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Croatian is the default language; the switcher updates title/description
// client-side for EN / SLO (see LanguageProvider).
export const metadata: Metadata = {
  title: "Rediscover 2026 radionice | Rentlio",
  description:
    "Dan nakon Rediscovera održavaju se radionice i prezentacije naših partnera. Prijavite se na vrijeme, broj mjesta je ograničen.",
  metadataBase: new URL("https://rediscover.rentl.io"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
