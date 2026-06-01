import {
  LayoutDashboard,
  Users,
  BellRing,
  ShoppingCart,
  Settings,
  CircleHelp,
} from "lucide-react";

export const sidebarItems = {
  admin: [
    { label: "Dashboard", route: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      label: "Users",
      icon: <Users size={18} />,
      children: [
        { label: "Create User", route: "/admin/createUser" },
      ],
    },
    {
      label: "Orders",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Pending Orders", route: "/admin/orders/pending" },
        { label: "Delievered Orders", route: "/admin/orders/delivered" },
      ],
    },
    {
      label: "Notifications",
      icon: <BellRing size={18} />,
      route: "/admin/notifications",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      children: [
        { label: "General Settings", route: "/admin/settings/generalSettings" },
        { label: "Notification Settings", route: "/admin/settings/notificationSettings" },
        { label: "Payment Settings", route: "/admin/settings/paymentSettings" },
      ],
    },
    {
      label: "Support",
      icon: <CircleHelp size={18} />,
      route: "/admin/support",
    },
  ],

  customer: [
    { label: "Dashboard", route: "/customer", icon: <LayoutDashboard size={18} /> },
    {
      label: "Orders",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "My Orders", route: "/customer/orders" },
        { label: "Place Order", route: "/customer/place" },
        { label: "Track Order", route: "/customer/track" },
      ],
    },
    {
      label: "Support",
      icon: <CircleHelp size={18} />,
      route: "/customer/support",
    },
  ],

  staff: [
    { label: "Dashboard", route: "/staff", icon: <LayoutDashboard size={18} /> },
    {
      label: "Orders",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Pending Orders", route: "/staff/orders/pending" },
        { label: "Delivered Orders", route: "/staff/orders/delivered" },
      ],
    },
    {
      label: "Support",
      icon: <CircleHelp size={18} />,
      route: "/customer/support",
    },
  ],

  partner: [
    { label: "Dashboard", route: "/partner", icon: <LayoutDashboard size={18} /> },
    {
      label: "My Deliveries",
      icon: <ShoppingCart size={18} />,
      children: [
        { label: "Pending", route: "/partner/deliveries/pending" },
        { label: "Picked Up", route: "/partner/deliveries/picked" },
        { label: "Delivered", route: "/partner/deliveries/delivered" },
      ],
    },
    {
      label: "Support",
      icon: <CircleHelp size={18} />,
      route: "/partner/support",
    },
  ],
};