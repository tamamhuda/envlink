import {
  User,
  CreditCard,
  Wallet2,
  Receipt,
  Settings,
  FolderArchive,
  BarChart2,
  Share2,
  LayoutDashboard,
  Lock,
} from "lucide-vue-next";

export const useMenu = () => {
  const dashboardMenu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      hide: false,
    },
    {
      name: "Links",
      href: "/dashboard/links",
      icon: FolderArchive,
      hide: false,
    },
    {
      name: "Archived",
      href: "/dashboard/archived",
      icon: FolderArchive,
      hide: false,
    },
    { name: "Channel", href: "/dashboard/channel", icon: Share2, hide: false },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
      hide: false,
    },
  ];

  const accountMenu = [
    { name: "Account", href: "/account", icon: User, hide: false },
    { name: "Profile", href: "/account/profile", icon: User, hide: true },
    {
      name: "Subscriptions",
      href: "/account/subscriptions",
      icon: Wallet2,
      hide: false,
    },
    {
      name: "Payment Methods",
      href: "/account/payment-methods",
      icon: CreditCard,
      hide: false,
    },
    {
      name: "Transactions",
      href: "/account/transactions",
      icon: Receipt,
      hide: false,
    },
    {
      name: "Settings",
      href: "/account/settings",
      icon: Settings,
      hide: false,
    },
    {
      name: "Security",
      href: "/account/settings/security",
      icon: Lock,
      hide: true,
    },
  ];

  return {
    dashboardMenu,
    accountMenu,
  };
};
