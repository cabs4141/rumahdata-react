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
  const sidebarWidth = isExpanded || isHovered ? "lg:pl-[290px]" : "lg:pl-[90px]";
  return (
    <div className="flex">
      {/* Sidebar tetap di luar */}
      <AppSidebar />
      <Backdrop />

      <div className={`flex flex-col  transition-all duration-300 ease-in-out min-w-0 ${sidebarWidth} ${isMobileOpen ? "ml-0" : ""}`}>
        <AppHeader />
        <main className="p-4 mx-auto w-full max-w-full md:p-6 mt-[72px] lg:mt-[70px] overflow-hidden">
          {/* overflow-hidden di sini memastikan tidak ada bocor ke samping */}
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
