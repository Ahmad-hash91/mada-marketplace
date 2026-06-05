import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

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
    <main>
      <h1>{t("title")}</h1>
    </main>
  );
}
