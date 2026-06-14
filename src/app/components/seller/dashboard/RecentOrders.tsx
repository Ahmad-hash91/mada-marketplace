import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { recentOrdersQuery } from "@/lib/seller-store/dashboardQueries";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function RecentOrders() {
  const t = await getTranslations("SellerDashboard.recentOrders");
  const payload = await getSessionFromCookies();

  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;
  const recentOrdersInfo = await recentOrdersQuery(storeId, 5);

  return (
    <>
      <p className="font-semibold text-text p-0 mb-2">{t("title")}</p>
      <div className="border border-secondary rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 bg-secondary/20 p-4">
          <p className="h-4 w-20">{t("product")}</p>
          <p className="h-4 w-20">{t("orderId")}</p>
          <p className="h-4 w-20">{t("customer")}</p>
          <p className="h-4 w-16">{t("status")}</p>
          <p className="h-4 w-16">{t("action")}</p>
        </div>

        {recentOrdersInfo.map((info) => (
          <div
            key={info.id}
            className="grid grid-cols-5 gap-4 p-4 border-t border-secondary"
          >
            <p className="h-4 w-24">{info.items[0].product.name}</p>
            <p className="h-4 w-16">{info.id}</p>
            <p className="h-4 w-20">{info.buyer.first_name}</p>
            <p className="h-4 w-16">{info.status}</p>
            {/* TODO: popup with call to action */}
            <button className=" h-6 w-10 bg-primary rounded-md text-white">
              ...
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
