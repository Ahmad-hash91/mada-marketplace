import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import SearchInputForm from "./SearchInputForm";

export async function TopBar() {
  const t = await getTranslations("SellerDashboard.topBar");
  const payload = await getSessionFromCookies();
  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const sellerInfo = await db.store.findFirst({
    where: {
      userId: payload.id,
      status: true,
    },
  });
  const storeName = sellerInfo?.name;
  const initialLetter = storeName?.charAt(0).toUpperCase();
  const storeLogo = sellerInfo?.logo;

  const imageAlt = sellerInfo?.name;

  return (
    <div className="flex items-center justify-between p-4 border-t border-x rounded-t-2xl border-secondary bg-background">
      <p className="h-6 w-auto text-text font-semibold">{t("title")}</p>

      <div className="flex items-center gap-3">
        <SearchInputForm />
        <Bell className="size-5" />
        {!storeLogo ? (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold font-sans">
            {initialLetter}
          </div>
        ) : (
          <Image
            src={storeLogo}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            alt={imageAlt ?? "store logo"}
          />
        )}

        <p className="font-semibold text-text">{storeName}</p>
      </div>
    </div>
  );
}
