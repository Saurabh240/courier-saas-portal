import React from "react";
import SideBar from "./SideBar";

const Layout = ({ userType, children }) => {
  return (
    <div className="flex min-h-screen bg-white text-black">
      <SideBar userType={userType} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;