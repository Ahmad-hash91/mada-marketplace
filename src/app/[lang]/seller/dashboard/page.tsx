import { DashboardSideBar } from "@/app/components/seller/dashboard/Sidebar";
import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  const payload = await getSessionFromCookies();
  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");
  //query DB for a store belongs to userId
  const sellerStore = await db.store.findFirst({
    where: {
      userId: payload.id,
      status: true,
    },
  });
  // redirect seller to create new store if no store found
  if (!sellerStore) {
    redirect("/en/seller/create-store");
  }

  // match show dashboard here
  return (
    <>
      <DashboardSideBar
        storeName={sellerStore.name}
        storeSlug={sellerStore.slug}
      />
    </>
  );
}
