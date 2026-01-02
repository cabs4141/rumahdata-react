import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CalenderIcon, ChevronDownIcon, GridIcon, HorizontaLDots, PieChartIcon, TableIcon, BoxCubeIcon, UserIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

// Definisikan struktur menu
const navItems = [
  {
    icon: <UserIcon />,
    name: "User",
    path: "/user",
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <TableIcon />,
    name: "Data",
    subItems: [
      { name: "Sekolah", path: "/sekolah", pro: false },
      { name: "PTK", path: "/ptk", pro: false },
      { name: "Kegiatan", path: "/kegiatan", pro: false },
    ],
  },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "Pengaturan",
  //   path: "/pengaturan",
  // },
  // {
  //   name: "Kalender",
  //   icon: <CalenderIcon />,
  //   path: "/kalender",
  // },
];

const othersItems = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [{ name: "Line Chart", path: "/line-chart", pro: false }],
  },
];

const AppSidebar = () => {
  // Menghapus isHovered dan setIsHovered
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Efek untuk membuka submenu saat halaman aktif dimuat
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

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

  // Fungsi untuk menangani klik toggle submenu
  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Fungsi render item menu
  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              // Menghapus referensi ke isHovered
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
              {/* Menghapus referensi ke isHovered */}
              {(isExpanded || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isMobileOpen) && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {/* Menghapus referensi ke isHovered */}
                {(isExpanded || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {/* Menghapus referensi ke isHovered */}
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
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>new</span>}
                        {subItem.pro && <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>pro</span>}
                      </span>
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
      {/* Menghapus referensi ke isHovered */}
      <div className={`py-6 flex ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isMobileOpen ? (
            // TAMBAHKAN 'hidden md:flex' di sini
            <div className="hidden md:flex flex-row justify-between items-center w-full">
              {/* Logo dan Teks Lebar (HANYA MUNCUL DARI MD KE ATAS) */}
              <img className="dark:hidden" src="/images/logo/sd.png" alt="Logo" width={50} height={30} />
              <img className="hidden dark:block" src="/images/logo/sd.png" alt="Logo" width={50} height={30} />
              <div className="font-semibold text-blue-light-700 ml-4">
                <p>Rumah Data</p>
                <p>BGTK NTB</p>
              </div>
            </div>
          ) : (
            // Logo Kecil (MUNCUL KETIKA SIDEBAR MINIMIZE)
            // Pastikan ini tersembunyi sepenuhnya di mode mobile jika sidebar tertutup.
            <img className="hidden lg:block" src="/images/logo/sd.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {/* Menghapus referensi ke isHovered */}
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}</h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              {/* Menghapus referensi ke isHovered */}
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isMobileOpen ? "Lainnya" : <HorizontaLDots />}</h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
