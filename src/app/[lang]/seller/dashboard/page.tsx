import { DashboardSideBar } from "@/app/components/seller/dashboard/Sidebar";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token, JWT_SECRET!);
  if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) return null;
  return payload;
}

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
      <DashboardSideBar storeName={sellerStore.name} />
    </>
  );
}
