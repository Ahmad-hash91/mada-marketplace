import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter, Noto_Sans_Arabic, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "../components/shared/Header";

export const metadata: Metadata = {
  title: "Mada Marketplace | مدى",
  description: "Syria's Online Marketplace",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter-font",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--noto-arabic-font",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--noto-jp-font",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  type Locale = (typeof routing.locales)[number];
  if (!routing.locales.includes(lang as Locale)) {
    notFound();
  }

  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${notoSansArabic.variable} ${notoSansJp.variable} ${
          lang === "ar"
            ? "font-arabic"
            : lang === "ja"
              ? "font-japanese"
              : "font-sans"
        } bg-background text-text antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Header lang={lang} />
        <div className="flex-1 pt-16 flex flex-col isolation-auto">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
