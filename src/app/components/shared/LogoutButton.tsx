"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.refresh();
    router.push(`/${lang}`);
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
    >
      Logout
    </button>
  );
}
