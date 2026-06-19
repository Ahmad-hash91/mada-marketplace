import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type SellerProductsProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SellerProducts({
  params,
  searchParams,
}: SellerProductsProps) {
  const { lang } = await params;
  const { search } = await searchParams;

  const t = await getTranslations("SellerProducts");
  setRequestLocale(lang);
  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const store = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  if (!store) redirect(`/${lang}/seller/create-store`);
  const storeId = store?.id;

  const searchQueryChecker = (
    storeId: number,
    queryString: string | string[] | undefined,
  ) => {
    const term = typeof queryString === "string" ? queryString.trim() : "";

    if (term.length === 0) {
      return { storeId };
    }
    return {
      storeId: storeId,
      name: {
        contains: term,
        mode: "insensitive" as const,
      },
    };
  };

  const products = await db.product.findMany({
    where: searchQueryChecker(storeId, search),
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 border border-secondary rounded-lg p-1 bg-background w-fit">
          <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary/10 text-primary">
            {t("all")}
          </button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md text-text/60 hover:bg-secondary/40 transition-colors">
            {t("active")}
          </button>
        </div>

        <Link
          href={`/${lang}/seller/products/new`}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("addProduct")}
        </Link>
      </div>

      <div className="border border-secondary rounded-lg overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/20 text-left text-text/70">
              <th className="p-4 font-medium">{t("product")}</th>
              <th className="p-4 font-medium">{t("status")}</th>
              <th className="p-4 font-medium">{t("inventory")}</th>
              <th className="p-4 font-medium">{t("description")}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text/60">
                  {t("noProducts")}
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-secondary hover:bg-secondary/10 transition-colors"
                >
                  <td className="p-4 text-text font-medium">{item.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status
                          ? "bg-green-100 text-green-700"
                          : "bg-secondary/40 text-text/60"
                      }`}
                    >
                      {item.status ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="p-4 text-text/80">{item.stock}</td>
                  <td className="p-4 text-text/60 truncate max-w-xs">
                    {item.description || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
