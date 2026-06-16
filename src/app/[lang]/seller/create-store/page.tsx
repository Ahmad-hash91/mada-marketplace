import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import CreateSellerStoreForm from "@/app/components/seller/CreateSellerStoreForm";
import { setRequestLocale } from "next-intl/server";

type CreateStoreProps = {
  params: Promise<{ lang: string }>;
};
export default async function CreateStorePage({ params }: CreateStoreProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const existingStore = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });

  if (existingStore) redirect(`/${lang}/seller/dashboard`);

  return <CreateSellerStoreForm />;
}
