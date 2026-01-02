import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { GridIcon, HorizontaLDots, PieChartIcon, TableIcon, UserIcon, ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../stores/useUserStore";

// Definisikan struktur menu asli
const navItems = [
  {
    icon: <UserIcon />,
    name: "User",
    path: "/user",
    roles: ["super_admin"],
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    roles: ["super_admin", "user", "admin"], // Bisa diakses semua
  },
  {
    icon: <TableIcon />,
    name: "Data",
    roles: ["super_admin", "user", "admin"],
    subItems: [
      { name: "Sekolah", path: "/sekolah", pro: false },
      { name: "PTK", path: "/ptk", pro: false },
      { name: "Kegiatan", path: "/kegiatan", pro: false },
    ],
  },
];

const othersItems = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [{ name: "Line Chart", path: "/line-chart", pro: false }],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const { token } = useUserStore(); // Ambil token dari Zustand

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // 1. Ambil Role dari Token secara aman
  const userRole = useMemo(() => {
    if (token && token !== "" && token !== "null" && token !== "undefined") {
      try {
        const decoded = jwtDecode(token);
        return decoded.role; // Sesuaikan dengan key role di payload JWT Anda
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [token]);

  // 2. Filter Nav Items berdasarkan Role
  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      // Jika item memiliki aturan roles, cek apakah role user ada di dalamnya
      if (item.roles) {
        return item.roles.includes(userRole);
      }
      return true; // Jika tidak ada aturan roles, tampilkan untuk semua
    });
  }, [userRole]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Efek untuk membuka submenu saat halaman aktif dimuat
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      // Gunakan filteredNavItems di sini
      const items = menuType === "main" ? filteredNavItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, filteredNavItems]);

  // Efek untuk menghitung tinggi submenu untuk animasi
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
              {(isExpanded || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isMobileOpen) && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {(isExpanded || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div className={`py-6 flex ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isMobileOpen ? (
            <div className="hidden md:flex flex-row justify-between items-center w-full">
              <img src="/images/logo/sd.png" alt="Logo" width={50} height={30} />
              <div className="font-semibold text-blue-light-700 ml-4">
                <p className="dark:text-white">Rumah Data</p>
                <p className="dark:text-white/60 text-xs">BGTK NTB</p>
              </div>
            </div>
          ) : (
            <img className="hidden lg:block" src="/images/logo/sd.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isMobileOpen ? "Menu Utama" : <HorizontaLDots className="size-6" />}</h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>

            <div>
              <h2 className={`mb-4 text-xs uppercase flex text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isMobileOpen ? "Lainnya" : <HorizontaLDots className="size-6" />}</h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
