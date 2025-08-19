import React, { useEffect } from "react";
import SideBar from "./SideBar";

const Layout = ({ userType, children }) => {
  useEffect(() => {
    const siteTitle = process.env.REACT_APP_SITE_TITLE || "Courier Portal";
    document.title = siteTitle;
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Fixed Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-screen bg-blue-900 text-white p-4 shadow-xl font-medium overflow-y-auto">
        <SideBar userType={userType} />
      </div>

      {/* Main Content shifted to the right */}
      <main className="flex-1 p-6 ml-64">{children}</main>
    </div>
  );
};

export default Layout;
