import CreateNewProductForm from "@/app/components/seller/CreateNewProductForm";
import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

type NewProductPageProps = {
  params: Promise<{ lang: string }>;
};
export default async function NewProductPage({ params }: NewProductPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const store = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  if (!store) redirect(`/${lang}/seller/create-store`);

  const categories = await db.category.findMany();
  return <CreateNewProductForm categories={categories} lang={lang} />;
}
