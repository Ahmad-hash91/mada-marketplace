"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { sideBarNavItems, sideBarSettingsItems } from "./SideBarData";

interface DashboardSideBarProps {
  storeName: string;
}

export function DashboardSideBar({ storeName }: DashboardSideBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const t = useTranslations("SellerDashboard.sidebar");

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 border-r border-gray-200 bg-white ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 h-16 shrink-0">
        {isExpanded && (
          <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-42.5">
            {storeName}
          </span>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-gray-100 ltr:ml-auto rtl:mr-auto"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {/* 1. Main Nav Loop (Stays locked to the top) */}
        {sideBarNavItems.map((data) => {
          const isActive = pathname === data.path;
          return (
            <Link
              key={data.titleKey}
              href={data.path}
              className={`flex items-center gap-4 p-2 rounded transition-colors ${
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl shrink-0 text-gray-500">
                {data.icon}
              </span>
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {t(data.titleKey)}
                </span>
              )}
            </Link>
          );
        })}

        {sideBarSettingsItems.map((parent) => {
          const isParentActive = pathname === parent.path;

          return (
            <div
              key={parent.titleKey}
              className="flex flex-col gap-1 mt-auto border-t border-gray-100 pt-3 shrink-0 w-full"
            >
              <div className="relative flex items-center w-full group">
                <Link
                  href={parent.path}
                  className={`flex items-center gap-4 p-2 w-full rounded transition-colors ltr:pr-10 rtl:pl-10 ${
                    isParentActive
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl shrink-0 text-gray-500">
                    {parent.icon}
                  </span>
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
                    className="absolute p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors ltr:right-2 rtl:left-2"
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
                  const isChildActive = pathname === child.path;
                  return (
                    <Link
                      key={child.titleKey}
                      href={child.path}
                      className={`text-sm py-2 px-3 rounded transition-colors flex items-center gap-3 ltr:ml-4 rtl:mr-4 ${
                        isChildActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="shrink-0 text-gray-400">
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
      </nav>
    </aside>
  );
}
