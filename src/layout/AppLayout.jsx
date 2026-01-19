import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router";
import { useNotificationStore } from "../stores/useNotifStore";
import { Alert, Snackbar } from "@mui/material";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Tentukan lebar margin/lebar sidebar agar bisa dipakai di Header juga
  const sidebarWidth = isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]";
  return (
    <div className="flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`
      flex flex-col flex-1 min-w-0
      transition-all duration-300 ease-in-out
      ${sidebarWidth}
      ${isMobileOpen ? "ml-0" : ""}
    `}
      >
        <AppHeader />

        <main className="p-4 w-full md:p-6 mt-[72px] lg:mt-[70px] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
