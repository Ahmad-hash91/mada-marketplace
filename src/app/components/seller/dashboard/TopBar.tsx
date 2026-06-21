import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { Bell } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import SearchInputForm from "./SearchInputForm";
import { SidebarToggleButton } from "./SidebarToggleButton";
import Link from "next/link";

type TopBarProps = {
  params: Promise<{ lang: string }>;
};
export async function TopBar({ params }: TopBarProps) {
  const t = await getTranslations("SellerDashboard.topBar");
  const payload = await getSessionFromCookies();

  const { lang } = await params;
  setRequestLocale(lang);
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

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
    <div className="flex items-center justify-between gap-3 p-4 border-t border-x rounded-t-2xl border-secondary bg-background">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarToggleButton />
        <Link
          href={`/${lang}/seller/dashboard`}
          className="text-text hidden lg:block font-semibold shrink-0 hover:text-primary transition-colors"
        >
          {t("title")}
        </Link>
      </div>
      <div className="flex-1 justify-center sm:justify-start min-w-0">
        <SearchInputForm />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Bell className="size-5 hidden md:block shrink-0" />
        {!storeLogo ? (
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold font-sans">
            {initialLetter}
          </div>
        ) : (
          <Image
            src={storeLogo}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover shrink-0"
            alt={imageAlt ?? "store logo"}
          />
        )}

        <p className="font-semibold hidden lg:block text-text">{storeName}</p>
      </div>
    </div>
  );
}
