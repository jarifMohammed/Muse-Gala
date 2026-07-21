"use client";

import SidebarContent from "./sidebar-content";

interface SidebarProps {
  token: string;
  userID: string;
}

const Sidebar = ({ token, userID }: SidebarProps) => {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#54051d] hidden lg:block">
      <SidebarContent token={token} userID={userID} />
    </div>
  );
};

export default Sidebar;
