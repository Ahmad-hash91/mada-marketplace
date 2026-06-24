import EditProductForm from "@/app/components/seller/EditProductForm";
import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

type EditProdcutPageProps = {
  params: Promise<{ lang: string; id: string }>;
};
export default async function EditProdcutPage({
  params,
}: EditProdcutPageProps) {
  const { lang, id } = await params;
  setRequestLocale(lang);
  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const store = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  if (!store) redirect(`/${lang}/seller/create-store`);

  const categories = await db.category.findMany();
  const specificProduct = await db.product.findFirst({
    where: { storeId: store.id, id: parseInt(id) },
  });
  if (!specificProduct) {
    redirect(`/${lang}/seller/products`);
  }
  return (
    <EditProductForm
      categories={categories}
      productId={id}
      lang={lang}
      product={specificProduct}
    />
  );
}
