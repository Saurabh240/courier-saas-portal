import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronUp,
  PlusSquare,
} from "lucide-react";

const SideBar = ({ userType }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Handle logout
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // clears user from AuthContext
    navigate("/"); // goes to Home
  };

  const items = {
    admin: [
      {
        label: "Dashboard",
        route: "/admin",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Create New Order",
        route: "/admin/orders/new",
        icon: <PlusSquare size={18} />,
      },
      {
        label: "Users",
        icon: <Users size={18} />,
        children: [
          { label: "Staff", route: "/admin/staff" },
          { label: "Partners", route: "/admin/partners" },
        ],
      },
      {
        label: "Orders",
        icon: <ShoppingCart size={18} />,
        children: [
          { label: "Pending", route: "/admin/orders/pending" },
          { label: "Delivered", route: "/admin/orders/delivered" },
        ],
      },
      {
        label: "Settings",
        route: "/admin/settings",
        icon: <Settings size={18} />,
      },
    ],
    customer: [
      {
        label: "Dashboard",
        route: "/customer",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Orders",
        icon: <ShoppingCart size={18} />,
        children: [
          { label: "My Orders", route: "/customer/orders" },
          { label: "Track Order", route: "/customer/track" },
        ],
      },
      {
        label: "Settings",
        route: "/customer/settings",
        icon: <Settings size={18} />,
      },
    ],
    staff: [
      {
        label: "Dashboard",
        route: "/staff",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Manage Tasks",
        route: "/staff/tasks",
        icon: <Users size={18} />,
      },
      {
        label: "Settings",
        route: "/staff/settings",
        icon: <Settings size={18} />,
      },
    ],
    partner: [
      {
        label: "Dashboard",
        route: "/partner",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Deliveries",
        route: "/partner/deliveries",
        icon: <ShoppingCart size={18} />,
      },
      {
        label: "Settings",
        route: "/partner/settings",
        icon: <Settings size={18} />,
      },
    ],
  };

  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-blue-900 text-white p-4 shadow-xl font-medium overflow-y-auto flex flex-col justify-between">
      {/* --- Top: Branding + Menu --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center capitalize tracking-wide">
          {userType} Panel
        </h2>
        <ul className="space-y-2 text-sm">
          {items[userType]?.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {openMenus[item.label] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {openMenus[item.label] && (
                    <ul className="ml-6 mt-1 space-y-1 border-l border-blue-500 pl-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.route}
                            className={`block px-3 py-1 rounded hover:bg-blue-600 transition ${
                              location.pathname === child.route
                                ? "bg-blue-700"
                                : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.route}
                  className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 transition ${
                    location.pathname === item.route ? "bg-blue-800" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* --- Bottom: Logout Button --- */}
      <div className="mt-4 border-t border-blue-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full rounded text-red-400 hover:text-white hover:bg-red-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
