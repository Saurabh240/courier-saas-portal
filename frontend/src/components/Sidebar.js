import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Menu, LogOut } from "lucide-react";
import { sidebarItems } from "../assets/sidebarMenu";
import { useNavigate } from "react-router-dom";

const SideBar = ({ userType }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const items = sidebarItems;

  return (
    <div
      className={`h-screen text-[#333] p-4 shadow-md transition-all duration-300 relative z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        backgroundColor: "#F3F6FD",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-wide text-[#333] capitalize">
            {userType} Panel
          </h2>
        )}
        <button onClick={toggleSidebar} className="text-[#333]">
          <Menu />
        </button>
      </div>

      {/* Menu List */}
      <ul className="space-y-2 text-sm relative">
        {items[userType]?.map((item) => {
          const isActive = location.pathname === item.route;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <li key={item.label} className="relative group">
              {hasChildren ? (
                <>
                  <button
                    onClick={() =>
                      !collapsed &&
                      setOpenMenus((prev) => ({
                        ...prev,
                        [item.label]: !prev[item.label],
                      }))
                    }
                    className={`w-full flex items-center ${
                      collapsed ? "justify-center" : "justify-between"
                    } px-3 py-2 rounded-lg hover:bg-[#E3EBFF] transition group`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {!collapsed && (
                        <span
                          className={`${
                            isActive ? "font-semibold text-[#687FE5]" : "text-[#333]"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                    {!collapsed &&
                      (openMenus[item.label] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </button>

                  {/* Collapsed floating submenu */}
                  {collapsed ? (
                    <ul className="absolute left-full top-0 mt-0 ml-2 bg-white text-black border shadow-lg rounded z-50 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-200 min-w-max">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.route}
                            className={`block px-4 py-2 rounded whitespace-nowrap hover:bg-[#687FE5] hover:text-white transition ${
                              location.pathname === child.route
                                ? "bg-[#00CAFF] font-bold text-white"
                                : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    openMenus[item.label] && (
                      <ul className="ml-6 mt-1 space-y-1 border-l border-[#687FE5]/40 pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.route}
                              className={`block px-4 py-1.5 rounded-md transition-all border-l-4 ${
                                location.pathname === child.route
                                  ? "bg-[#687FE5] text-white font-semibold border-[#00CAFF]"
                                  : "text-[#333] border-transparent hover:bg-[#E3EBFF]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </>
              ) : (
                <Link
                  to={item.route}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  } px-3 py-2 rounded-lg transition group ${
                    isActive
                      ? "bg-[#687FE5] text-white font-semibold"
                      : "hover:bg-[#E3EBFF] text-[#333]"
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black text-white text-xs font-medium rounded shadow-md px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300 whitespace-nowrap pointer-events-none group-hover:pointer-events-auto z-50">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <hr className="border-t border-[#687FE5]/30 mb-3" />
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-start gap-2"
          } px-3 py-2 rounded-lg text-[#E53935] hover:bg-red-100 transition group`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}

          {/* Tooltip in collapsed mode */}
          {collapsed && (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black text-white text-xs font-medium rounded shadow-md px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300 whitespace-nowrap pointer-events-none group-hover:pointer-events-auto z-50">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;