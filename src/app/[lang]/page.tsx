import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations("HomePage");

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/20 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold text-primary mb-2">Mada</h1>
        <h2 className="text-3xl font-bold text-text mb-4">{t("headline")}</h2>
        <p className="text-text/70 mb-8">{t("subtext")}</p>
        <div className="flex justify-center gap-4">
          <Link
            href={`/${lang}/register`}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {t("getStarted")}
          </Link>
          <Link
            href={`/${lang}/login`}
            className="border border-secondary text-text px-6 py-3 rounded-lg font-medium hover:bg-secondary/30 transition-colors"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </main>
  );
}
