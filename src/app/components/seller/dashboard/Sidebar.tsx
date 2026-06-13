"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../../shared/LanguageSwitcher";
import { sideBarNavItems, sideBarSettingsItems } from "./SideBarData";
import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Globe,
} from "lucide-react";

interface DashboardSideBarProps {
  storeName: string;
  storeSlug: string;
}

export function DashboardSideBar({
  storeName,
  storeSlug,
}: DashboardSideBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const t = useTranslations("SellerDashboard.sidebar");

  const pathWithoutLocale = pathname.replace(/^\/(en|ar|ja)/, "");

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 border-e border-secondary bg-background ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 h-16 shrink-0">
        {isExpanded && (
          <span className="font-semibold text-text whitespace-nowrap overflow-hidden text-ellipsis max-w-42.5">
            {storeName}
          </span>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-secondary/50 ltr:ml-auto rtl:mr-auto"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <PanelLeftClose className="size-5 text-text" />
          ) : (
            <PanelLeftOpen className="size-5 text-text" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {sideBarNavItems.map((data) => {
          const itemPathWithoutLocale = data.path.replace(/^\/(en|ar|ja)/, "");
          const isActive = pathWithoutLocale === itemPathWithoutLocale;
          return (
            <Link
              key={data.titleKey}
              href={data.path}
              title={t(data.titleKey)}
              className={`flex items-center gap-4 p-2 rounded transition-colors ${
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-text/70 hover:bg-secondary/40"
              }`}
            >
              <span className="text-xl shrink-0">{data.icon}</span>
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {t(data.titleKey)}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href={`/en/stores/${storeSlug}`}
          title={t("StorePage")}
          className="flex items-center gap-4 p-2 rounded transition-colors text-text/70 hover:bg-secondary/40"
        >
          <span className="text-xl shrink-0">
            <Globe className="size-5" />
          </span>
          {isExpanded && (
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {t("StorePage")}
            </span>
          )}
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-2 p-2 border-t border-secondary bg-background shrink-0 w-full">
        {sideBarSettingsItems.map((parent) => {
          const isParentActive =
            pathWithoutLocale === parent.path.replace(/^\/(en|ar|ja)/, "");

          return (
            <div key={parent.titleKey} className="flex flex-col gap-1 w-full">
              <div className="relative flex items-center w-full group">
                <Link
                  href={parent.path}
                  title={t(parent.titleKey)}
                  className={`flex items-center gap-4 p-2 w-full rounded transition-colors ltr:pr-10 rtl:pl-10 ${
                    isParentActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-text/70 hover:bg-secondary/40"
                  }`}
                >
                  <span className="text-xl shrink-0">{parent.icon}</span>
                  {isExpanded && (
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                      {t(parent.titleKey)}
                    </span>
                  )}
                </Link>

                {isExpanded && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSettingsOpen(!isSettingsOpen);
                    }}
                    className="absolute p-1 rounded hover:bg-secondary/60 text-text/40 hover:text-text/70 transition-colors ltr:right-2 rtl:left-2"
                    aria-label="Toggle settings menu"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${
                        isSettingsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {isSettingsOpen &&
                isExpanded &&
                parent.children.map((child) => {
                  const isChildActive =
                    pathWithoutLocale ===
                    child.path.replace(/^\/(en|ar|ja)/, "");
                  return (
                    <Link
                      key={child.titleKey}
                      href={child.path}
                      title={t(child.titleKey)}
                      className={`text-sm py-2 px-3 rounded transition-colors flex items-center gap-3 ltr:ml-4 rtl:mr-4 ${
                        isChildActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text/70 hover:bg-secondary/40"
                      }`}
                    >
                      <span className="shrink-0 text-text/40">
                        {child.icon}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {t(child.titleKey)}
                      </span>
                    </Link>
                  );
                })}
            </div>
          );
        })}
        {isExpanded ? (
          <div className="pt-2 border-t border-secondary w-full">
            <LanguageSwitcher />
          </div>
        ) : (
          <Globe className="size-5 shrink-0 ltr:mx-2 rtl:mx-2 text-text/50" />
        )}
      </div>
    </aside>
  );
}
