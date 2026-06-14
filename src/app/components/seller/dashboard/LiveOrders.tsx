import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { liveOrdersQuery } from "@/lib/seller-store/dashboardQueries";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function LiveOrders() {
  const t = await getTranslations("SellerDashboard.liveOrders");
  const payload = await getSessionFromCookies();

  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const liveOrders = await liveOrdersQuery(storeId);

  return (
    <div className="border border-secondary rounded-lg p-4 space-y-4 bg-background">
      <p className="font-semibold text-text">{t("title")}</p>

      {liveOrders.length === 0 ? (
        <p className="text-sm text-text/60">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {liveOrders.map((order) => {
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;
            return (
              <div
                key={order.id}
                className="flex justify-between items-center gap-4"
              >
                <p className="text-sm text-text truncate">
                  {order.buyer.first_name} purchased {firstItem?.quantity}x{" "}
                  {firstItem?.product.name}
                  {extraCount > 0 && ` +${extraCount} more`}
                </p>
                <p className="text-xs text-text/50 shrink-0">
                  {formatDistanceToNow(order.created_at, { addSuffix: true })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
