import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HorizontaLDots, ChevronDownIcon } from "@/icons";
import { useSidebar } from "@/context/SidebarContext";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "@/features/users/stores/useUserStore";
import { useSettingsStore } from "@/features/settings/stores/useSettingsStore";
import PeopleSharpIcon from "@mui/icons-material/PeopleSharp";
import StorageIcon from "@mui/icons-material/Storage";
import GridViewIcon from "@mui/icons-material/GridView";
import MobiledataOffSharpIcon from "@mui/icons-material/MobiledataOffSharp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";

const navItems = [
  {
    icon: <GridViewIcon sx={{ fontSize: 22 }} />,
    name: "Dashboard",
    path: "/",
    roles: ["user", "admin"],
  },
  {
    icon: <StorageIcon sx={{ fontSize: 22 }} />,
    name: "Data",
    roles: ["user", "admin"],
    subItems: [
      { name: "SEKOLAH", path: "/sekolah", permission: "sekolah" },
      { name: "PTK", path: "/ptk", permission: "ptk" },
      { name: "PPG", path: "/ppg", permission: "ppg" },
      { name: "PEMETAAN KOMPETENSI", path: "/pemetaan", permission: "pemetaan_kompetensi" },
      { name: "STATISTIK", path: "/statistik" },
    ],
  },
  {
    icon: <EventNoteIcon sx={{ fontSize: 22 }} />,
    name: "Kegiatan",
    roles: ["user", "admin"],
    subItems: [
      { name: "DATA KEGIATAN", path: "/kegiatan", permission: "kegiatan" },
      { name: "STATISTIK KEGIATAN", path: "/kegiatan/statistik", permission: "kegiatan" },
    ],
  },
  {
    icon: <MobiledataOffSharpIcon sx={{ fontSize: 22 }} />,
    name: "Split Data",
    path: "/split-data",
    roles: ["admin", "user"],
  },
  {
    icon: <PeopleSharpIcon sx={{ fontSize: 22 }} />,
    name: "Manajemen User",
    path: "/user",
    roles: ["admin"],
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 22 }} />,
    name: "Pengaturan",
    path: "/pengaturan",
    roles: ["admin"],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const { token, permissions = [] } = useUserStore();
  const { siteTitle, siteSubtitle, logoUrl, siteTitleColor, siteSubtitleColor } = useSettingsStore();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const userRole = useMemo(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.role;
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [token]);

  const filteredNavItems = useMemo(() => {
    return navItems
      .filter((item) => {
        if (!item.roles || item.roles.includes(userRole)) {
          if (userRole === "user" && item.permission && !permissions.includes(item.permission)) return false;
          return true;
        }
        return false;
      })
      .map((item) => {
        if (item.subItems && userRole === "user") {
          const filteredSubItems = item.subItems.filter((sub) => !sub.permission || permissions.includes(sub.permission));
          return { ...item, subItems: filteredSubItems };
        }
        return item;
      })
      .filter((item) => !item.subItems || item.subItems.length > 0);
  }, [userRole, permissions]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    filteredNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, filteredNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) => (prev?.index === index && prev?.type === menuType ? null : { type: menuType, index }));
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-1.5">
      {items.map((nav, index) => {
        const isCurrentOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isAnySubActive = nav.subItems?.some((sub) => isActive(sub.path));
        const isVisualActive = isCurrentOpen || isAnySubActive || (nav.path && isActive(nav.path));

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full flex items-center px-4 py-3 rounded-sm transition-all duration-200 group
                ${isVisualActive ? "bg-[#1976d2] text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span className={`${isVisualActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>{nav.icon}</span>
                {(isExpanded || isMobileOpen) && (
                  <>
                    <span className={`ml-3 text-sm font-semibold`}>{nav.name}</span>
                    <ChevronDownIcon className={`ml-auto w-4 h-4 transition-transform duration-200 ${isCurrentOpen ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
            ) : (
              <Link
                to={nav.path}
                className={`flex items-center px-4 py-3 rounded-sm transition-all duration-200 group
                ${isActive(nav.path) ? "bg-[#1976d2] text-white shadow-md shadow-blue-500/30" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span className={`${isActive(nav.path) ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>{nav.icon}</span>
                {(isExpanded || isMobileOpen) && <span className="ml-3 text-sm font-semibold">{nav.name}</span>}
              </Link>
            )}

            {/* Render SubItems */}
            {nav.subItems && (isExpanded || isMobileOpen) && (
              <div
                ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ height: isCurrentOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
              >
                <ul className="mt-1 ml-10 space-y-1 border-l border-gray-200">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`block py-2 pl-4 text-sm transition-colors rounded-r-lg
                        ${isActive(subItem.path) ? "text-[#1976d2] font-bold border-l-2 border-[#1976d2] -ml-[1.5px] bg-[#1976d2]/5" : "text-gray-500 hover:text-[#1976d2] hover:bg-gray-50"}`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white transition-all duration-300 border-r border-gray-100 flex flex-col
        ${isExpanded || isMobileOpen ? "w-[280px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Brand Header */}
      <div className={`h-[70px] flex items-center px-6 mb-4`}>
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="Logo" width={38} className="flex-shrink-0" />
          {(isExpanded || isMobileOpen) && (
            <div className="ml-3">
              <p className="font-extrabold text-[15px] leading-tight tracking-tight" style={{ color: siteTitleColor || "#1976d2" }}>{siteTitle}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: siteSubtitleColor || "#9ca3af" }}>{siteSubtitle}</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <h2 className={`px-4 mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${!isExpanded ? "text-center" : ""}`}>{isExpanded || isMobileOpen ? "Menu Utama" : <HorizontaLDots className="w-5 h-5 mx-auto" />}</h2>
          {renderMenuItems(filteredNavItems, "main")}
        </div>
      </div>

      {/* Version Footer */}
      <div className="p-6">
        <div className={`bg-gray-50 rounded-xl p-3 flex items-center ${!isExpanded ? "justify-center" : "gap-3"}`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {isExpanded && <span className="text-[14px] font-bold text-gray-400 tracking-tighter"> © 2026 RUMAH DATA • v1.0</span>}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
