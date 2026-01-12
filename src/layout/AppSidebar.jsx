import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HorizontaLDots, ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../stores/useUserStore";
import PeopleSharpIcon from "@mui/icons-material/PeopleSharp";
import StorageIcon from "@mui/icons-material/Storage";
import GridViewIcon from "@mui/icons-material/GridView";

const navItems = [
  {
    icon: <GridViewIcon sx={{ fontSize: 22 }} />,
    name: "Dashboard",
    path: "/",
    roles: ["super_admin", "user", "admin"],
  },
  {
    icon: <StorageIcon sx={{ fontSize: 22 }} />,
    name: "Data",
    roles: ["super_admin", "user", "admin"],
    subItems: [
      { name: "Data Sekolah", path: "/sekolah" },
      { name: "Data PTK", path: "/ptk" },
      { name: "Data Kegiatan", path: "/kegiatan" },
    ],
  },
  {
    icon: <PeopleSharpIcon sx={{ fontSize: 22 }} />,
    name: "Daftar User",
    path: "/user",
    roles: ["super_admin"],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const { token } = useUserStore();

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
    return navItems.filter((item) => !item.roles || item.roles.includes(userRole));
  }, [userRole]);

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

  // ... kode import tetap sama

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-1.5">
      {items.map((nav, index) => {
        const isCurrentOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isAnySubActive = nav.subItems?.some((sub) => isActive(sub.path));

        // Indikator apakah item ini (induk atau link tunggal) sedang aktif secara visual
        const isVisualActive = isCurrentOpen || isAnySubActive || (nav.path && isActive(nav.path));

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full flex items-center px-4 py-3 rounded-sm transition-all duration-200 group
                ${isVisualActive ? "bg-[#1976d2] text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {/* Ikon jadi putih saat aktif agar terlihat jelas di bg biru */}
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

  // ... sisa kode return aside tetap sama

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white transition-all duration-300 border-r border-gray-100 flex flex-col
        ${isExpanded || isMobileOpen ? "w-[280px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Brand Header */}
      <div className={`h-[70px] flex items-center px-6 mb-4`}>
        <Link to="/" className="flex items-center">
          <img src="/images/logo/sd.png" alt="Logo" width={38} className="flex-shrink-0" />
          {(isExpanded || isMobileOpen) && (
            <div className="ml-3">
              <p className="text-[#1976d2] font-extrabold text-[15px] leading-tight tracking-tight">RUMAH DATA</p>
              <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">BGTK NTB</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <h2 className={`px-4 mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-300 ${!isExpanded ? "text-center" : ""}`}>{isExpanded || isMobileOpen ? "Main Menu" : <HorizontaLDots className="w-5 h-5 mx-auto" />}</h2>
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
