import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { recentOrdersQuery } from "@/lib/seller-store/dashboardQueries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type LiveOrdersProps = {
  params: Promise<{ lang: string }>;
};

export default async function LiveOrders({ params }: LiveOrdersProps) {
  const t = await getTranslations("SellerDashboard.liveOrders");
  const payload = await getSessionFromCookies();
  const { lang } = await params;
  setRequestLocale(lang);

  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const liveOrders = await recentOrdersQuery(storeId, 3);

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
