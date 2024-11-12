"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { fetchUserPermissions } from '@/utils/api';
import Image from 'next/image';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Dữ liệu menu mặc định với quyền truy cập
const defaultMenuGroups = [
  {
    name: "MENU",
    menuItems: [
      { label: "Tổng quan", route: "/dashboard", access: "overview" },
      { label: "Tổng quan", route: "/admin/dashboard-admin", access: "overview_admin" },
      { label: "Quyền và tài khoản", route: "/admin/permissionmanagement", access: "permissionmanagement" },
      { label: "Quản lý tài khoản", route: "/admin/acounts", access: "accountsmanager" },
      { label: "Quản lý kho", route: "/admin/warehouse", access: "manager_warehouse" },
      {
        label: "Hàng hóa",
        route: "#",
        access: "products",
        children: [
          { label: "Hàng hóa", route: "/products", access: "products_view" },
          { label: "Thiết lập giá", route: "/set-prices", access: "set_prices" },
          { label: "Kiểm kho", route: "/inventorycheckslip", access: "inventory_check" },
        ],
      },
      {
        label: "Giao dịch",
        route: "#",
        access: "transactions",
        children: [
          { label: "Nhập hàng", route: "/receipts", access: "receipts_view" },
          { label: "Trả hàng nhập", route: "/deliverynotes", access: "return_goods" },
          { label: "Xuất hủy", route: "/remove-items", access: "dispose_items" },
          { label: "Bán hàng", route: "/order", access: "order" },
          { label: "Hóa đơn", route: "/invoice", access: "invoice_view" },
          { label: "Trả hàng", route: "/order/return", access: "return_order" },
        ],
      },
      {
        label: "Vận chuyển",
        route: "#",
        access: "shipping",
        children: [
          { label: "Chuyển kho", route: "/transfer", access: "transfer" },
          { label: "Nhập kho", route: "/transfer/import", access: "import_transfer" },
        ],
      },
      {
        label: "Đối tác",
        route: "#",
        access: "partners",
        children: [
          { label: "Khách hàng", route: "/customers", access: "customers" },
          { label: "Nhà cung cấp", route: "/suppliers", access: "suppliers" },
        ],
      },
      {
        label: "Sổ quỹ",
        route: "/fund",
        access: "fund",
      },
      {
        label: "Nhân viên",
        route: "#",
        access: "employees",
        children: [
          { label: "Nhân viên", route: "/employees", access: "employees_view" },
          { label: "Lịch làm việc", route: "/workshift", access: "workshift" },
          { label: "Bảng tính lương", route: "/pay-roll", access: "payroll" },
          { label: "Thiết lập chung", route: "/settings/salary", access: "salary_settings" },
        ],
      },
      {
        label: "Báo cáo",
        route: "#",
        access: "reports",
        children: [
          { label: "Tồn kho", route: "/report/inventory", access: "report_inventory" },
          { label: "Nhập - Xuất", route: "/report/import-export", access: "report_import_export" },
          { label: "Nhập - Nhà cung cấp", route: "/report/import-supplier", access: "report_import_supplier" },
          { label: "Xu hướng mặt hàng", route: "/report/trending", access: "report_trending" },
        ],
      },
      {
        label: "Gợi ý",
        route: "#",
        access: "suggestions",
        children: [
          { label: "Xu hướng SL nhập", route: "/predict", access: "predict_trends" },
        ],
      },
    ],
  },
];

// Dữ liệu quyền truy cập giả
const mockPermissions = [
  // Quyền cho các mục chính
  "overview",
  "products",
  "transactions",
  "shipping",
  "partners",
  "fund",
  "employees",
  "reports",
  "suggestions",
  "overview_admin",
  "permissionmanagement",
  "manager_warehouse",

  // Quyền cho các mục con trong "Hàng hóa"
  "products_view",
  "set_prices",
  "inventory_check",

  // Quyền cho các mục con trong "Giao dịch"
  "receipts_view",
  "return_goods",
  "dispose_items",
  "order",
  "invoice_view",
  "return_order",

  // Quyền cho các mục con trong "Vận chuyển"
  "transfer",
  "import_transfer",

  // Quyền cho các mục con trong "Đối tác"
  "customers",
  "suppliers",

  // Quyền cho các mục con trong "Nhân viên"
  "employees_view",
  "workshift",
  "payroll",
  "salary_settings",

  // Quyền cho các mục con trong "Báo cáo"
  "report_inventory",
  "report_import_export",
  "report_import_supplier",
  "report_trending",

  // Quyền cho các mục con trong "Gợi ý"
  "predict_trends",
];


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [menuGroups, setMenuGroups] = useState(defaultMenuGroups);
  const [permissions, setPermissions] = useState<string[]>([]);

  // Lấy quyền từ API
  const fetchPermissions = async () => {
    try {
      // Giả sử token được lưu trữ trong cookie hoặc localStorage
      const sessionToken = localStorage.getItem("authToken") || ""; // Thay đổi cách lấy token nếu cần thiết
      
      // Truyền token vào `fetchUserPermissions`
      const userPermissionsData = await fetchUserPermissions(sessionToken);

      if (userPermissionsData) {
        setPermissions(userPermissionsData.permissions); // Lưu quyền vào state
      }
    } catch (error) {
      console.error("Lỗi khi lấy quyền từ API:", error);
    }
  };

  useEffect(() => {
    fetchPermissions(); // Gọi API khi component mount
  }, []);

  useEffect(() => {
    // Cập nhật menu dựa trên quyền lấy từ API
    const updateMenuGroups = () => {
      const filteredMenuGroups = defaultMenuGroups.map((group) => ({
        ...group,
        menuItems: group.menuItems.filter((menuItem) => {
          if (menuItem.children) {
            menuItem.children = menuItem.children.filter((child) =>
              permissions.includes(child.access)
            );
          }
          return (
            permissions.includes(menuItem.access) ||
            (menuItem.children && menuItem.children.length > 0)
          );
        }),
      }));

      setMenuGroups(filteredMenuGroups);
    };

    if (permissions.length > 0) {
      updateMenuGroups();
    }
  }, [permissions]);

  useEffect(() => {
    setPageName(pathname || "dashboard");
  }, [pathname, setPageName]);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-56 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-2">
        <div className="flex items-center text-center font-bold text-white mt-5 px-4 py-1">
        <Image 
          src="/images/logo/dog-logo.png" // Đường dẫn đến logo của bạn
          alt="Logo"
          width={64} // Chiều rộng logo, điều chỉnh cho phù hợp
          height={64} // Chiều cao logo, điều chỉnh cho phù hợp
          className="mr-3"
        />
        <h2>TT  INVENTORY</h2>
      </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            Toggle Sidebar
          </button>
        </div>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-8 lg:mt-2 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;