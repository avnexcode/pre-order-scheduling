export const sidebarMenu = [
  {
    label: "Application",
    menu: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Pelanggan",
        url: "/dashboard/customer",
        icon: "User",
      },
      {
        title: "Produk",
        url: "/dashboard/product",
        icon: "Table",
      },
      {
        title: "Pesanan",
        url: "/dashboard/order",
        icon: "ShoppingBag",
      },
      {
        title: "Transaksi",
        url: "/dashboard/transaction",
        icon: "ArrowLeftRight",
      },
    ],
  },
  {
    label: "Settings",
    menu: [
      {
        title: "Profile",
        url: "settings/profile",
        icon: "User",
      },
      {
        title: "Reset Password",
        url: "/dashboard/reset-password",
        icon: "KeyRound",
      },
    ],
  },
];
