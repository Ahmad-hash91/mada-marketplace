import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import CreateSellerStoreForm from "@/app/components/seller/CreateSellerStoreForm";

export default async function CreateStorePage() {
  const payload = await getSessionFromCookies();
  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const existingStore = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });

  if (existingStore) redirect("/en/seller/dashboard");

  return <CreateSellerStoreForm />;
}
