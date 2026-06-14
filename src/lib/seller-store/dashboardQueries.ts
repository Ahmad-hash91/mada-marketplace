import db from "@/lib/db";

export async function KPIQueries(storeId: number) {
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

export async function todaysPerformanceQueries(storeId: number) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const todayRevenueResult = await db.order.aggregate({
    where: { created_at: { gte: startOfToday }, storeId, status: "DELIVERED" },
    _sum: { total_amount: true },
  });
  const todayRevenue = todayRevenueResult._sum.total_amount || 0;
  const yesterdayRevenueResult = await db.order.aggregate({
    where: {
      created_at: { gte: startOfYesterday, lt: startOfToday },
      storeId,
      status: "DELIVERED",
    },
    _sum: { total_amount: true },
  });
  const yesterdayRevenue = yesterdayRevenueResult._sum.total_amount || 0;
  return {
    todayRevenue,
    yesterdayRevenue,
  };
}

export async function recentOrdersQuery(storeId: number, limit: number) {
  const orders = await db.order.findMany({
    where: { storeId },
    orderBy: { created_at: "desc" },
    take: limit,
    include: {
      buyer: true,
      items: {
        include: { product: true },
      },
    },
  });
  return orders;
}

export async function topSellingProducts(storeId: number) {
  const orderItems = await db.orderItem.findMany({
    where: {
      order: { storeId },
    },
    include: { product: true },
  });
  const productCounts: Record<
    number,
    { product: (typeof orderItems)[0]["product"]; totalQuantity: number }
  > = {};

  for (const item of orderItems) {
    if (!productCounts[item.productId]) {
      productCounts[item.productId] = {
        product: item.product,
        totalQuantity: 0,
      };
    }
    productCounts[item.productId].totalQuantity += item.quantity;
  }
  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 3);

  return {
    topProducts,
  };
}

export async function revenueChartQuery(storeId: number) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyRevenue = monthNames.map((month) => ({ month, revenue: 0 }));
  const orders = await db.order.findMany({
    where: {
      storeId,
      status: "DELIVERED",
      created_at: { gte: startOfYear, lt: endOfYear },
    },
    select: { total_amount: true, created_at: true },
  });
  for (const order of orders) {
    const monthIndex = order.created_at.getMonth();
    monthlyRevenue[monthIndex].revenue += order.total_amount;
  }
  return monthlyRevenue;
}
