import db from "@/lib/db";

export async function dashboardQueries(storeId: number) {
  const totalRevenueResults = await db.order.aggregate({
    where: { storeId: storeId, status: "DELIVERED" },
    _sum: { total_amount: true },
  });

  const totalOrders = await db.order.count({
    where: { storeId: storeId },
  });
  const customerRows = await db.order.findMany({
    where: { storeId: storeId },
    distinct: ["buyerId"],
    select: { buyerId: true },
  });
  const storeViews = await db.storeView.aggregate({
    where: { storeId },
    _sum: { count: true },
  });
  const totalViews = storeViews._sum.count || 0;
  const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;
  const totalRevenue = totalRevenueResults._sum.total_amount || 0;
  const totalCustomers = customerRows.length;
  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    conversionRate,
  };
}
