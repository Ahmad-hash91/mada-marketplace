import { Metadata } from "next";
import { DashboardSideBar } from "@/app/components/seller/dashboard/Sidebar";
import { getSessionFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Mada marketplace's seller dashboard",
};

type RootDashboardProps = {
  children: React.ReactNode;
};

export default async function RootDashboardLayout({
  children,
}: RootDashboardProps) {
  const payload = await getSessionFromCookies();
  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

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

  return (
    <div className="flex h-screen">
      <DashboardSideBar
        storeName={sellerStore.name}
        storeSlug={sellerStore.slug}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
