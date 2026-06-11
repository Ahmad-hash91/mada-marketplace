import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  User,
  CreditCard,
  Bell,
  HelpCircle,
} from "lucide-react";

interface SidebarItem {
  titleKey: string;
  path: string;
  icon: React.ReactNode;
}
interface SidebarSettingsItem extends SidebarItem {
  children: SidebarItem[];
}

export const sideBarNavItems: SidebarItem[] = [
  {
    titleKey: "dashboard",
    path: "/en/seller/dashboard",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    titleKey: "orders",
    path: "/en/seller/orders",
    icon: <ShoppingCart className="size-5" />,
  },
  {
    titleKey: "products",
    path: "/en/seller/products",
    icon: <Package className="size-5" />,
  },
  {
    titleKey: "customers",
    path: "/en/seller/customers",
    icon: <Users className="size-5" />,
  },
  {
    titleKey: "analytics",
    path: "/en/seller/analytics",
    icon: <BarChart3 className="size-5" />,
  },
];

export const sideBarSettingsItems: SidebarSettingsItem[] = [
  {
    titleKey: "settings",
    path: "/en/seller/settings",
    icon: <Settings className="size-5" />,
    children: [
      {
        titleKey: "account",
        path: "/en/seller/settings/account",
        icon: <User className="size-4" />,
      },
      {
        titleKey: "billing",
        path: "/settings/billing",
        icon: <CreditCard className="size-4" />,
      },
      {
        titleKey: "notifications",
        path: "/settings/notifications",
        icon: <Bell className="size-4" />,
      },
      {
        titleKey: "faqHelp",
        path: "/settings/faq-help",
        icon: <HelpCircle className="size-4" />,
      },
    ],
  },
];
