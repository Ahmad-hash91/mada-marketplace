"use client";

import { Menu } from "lucide-react";
import { useMobileSidebarStore } from "@/store/useMobileSidebarStore";

export function SidebarToggleButton() {
  const { toggle } = useMobileSidebarStore();

  return (
    <button
      onClick={toggle}
      className="lg:hidden p-2 rounded hover:bg-secondary/40 text-text shrink-0"
      aria-label="Toggle sidebar"
    >
      <Menu className="size-5" />
    </button>
  );
}
