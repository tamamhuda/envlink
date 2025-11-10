import {
  User,
  CreditCard,
  Wallet2,
  Receipt,
  Settings,
  Link2,
  FolderArchive,
  BarChart2,
  Share2,
  LayoutDashboard,
  Pencil,
} from "lucide-vue-next";

export const useMenu = () => {
  const dashboardMenu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Links", href: "/dashboard/links", icon: FolderArchive },
    { name: "Archived", href: "/dashboard/archived", icon: FolderArchive },
    { name: "Channel", href: "/dashboard/channel", icon: Share2 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  ];

  const accountMenu = [
    { name: "Account", href: "/account", icon: User },
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Subscriptions", href: "/account/subscriptions", icon: Wallet2 },
    {
      name: "Payment Methods",
      href: "/account/payment-methods",
      icon: CreditCard,
    },
    { name: "Transactions", href: "/account/transactions", icon: Receipt },
    { name: "Settings", href: "/account/settings", icon: Settings },
  ];

  return {
    dashboardMenu,
    accountMenu,
  };
};
