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

export const getSideBarNavItems = (lang: string): SidebarItem[] => [
  {
    titleKey: "dashboard",
    path: `/${lang}/seller/dashboard`,
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    titleKey: "orders",
    path: `/${lang}/seller/orders`,
    icon: <ShoppingCart className="size-5" />,
  },
  {
    titleKey: "products",
    path: `/${lang}/seller/products`,
    icon: <Package className="size-5" />,
  },
  {
    titleKey: "customers",
    path: `/${lang}/seller/customers`,
    icon: <Users className="size-5" />,
  },
  {
    titleKey: "analytics",
    path: `/${lang}/seller/analytics`,
    icon: <BarChart3 className="size-5" />,
  },
];

export const getSideBarSettingsItems = (
  lang: string,
): SidebarSettingsItem[] => [
  {
    titleKey: "settings",
    path: `/${lang}/seller/settings`,
    icon: <Settings className="size-5" />,
    children: [
      {
        titleKey: "account",
        path: `/${lang}/seller/settings/account`,
        icon: <User className="size-4" />,
      },
      {
        titleKey: "billing",
        path: `/${lang}/seller/settings/billing`,
        icon: <CreditCard className="size-4" />,
      },
      {
        titleKey: "notifications",
        path: `/${lang}/seller/settings/notifications`,
        icon: <Bell className="size-4" />,
      },
      {
        titleKey: "faqHelp",
        path: `/${lang}/seller/settings/faq-help`,
        icon: <HelpCircle className="size-4" />,
      },
    ],
  },
];
