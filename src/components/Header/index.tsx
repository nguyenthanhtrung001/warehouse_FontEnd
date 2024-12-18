import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [warehouses, setWarehouses] = useState([2]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | number>(
    "",
  );
  const { employee } = useEmployeeStore();

  // Gọi API để lấy danh sách kho
  useEffect(() => {
    if (!employee) return;
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("http://localhost:8888/v1/api/warehouses");
        const data = await response.json();
        setWarehouses(data);
        // Thiết lập giá trị mặc định là kho đầu tiên trong danh sách
        if (data.length > 0) {
          setSelectedWarehouse(employee.warehouseId);
          
        }
      } catch (error) {
        console.error("Failed to fetch warehouses", error);
      }
    };

    fetchWarehouses();
  }, [employee]);

  // Xử lý khi thay đổi lựa chọn kho
  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWarehouse(e.target.value);
    // Thực hiện các hành động khác khi chọn kho mới (nếu cần)
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {/* Hamburger lines */}
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }
                `}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }
                `}
                ></span>
              </span>
            </span>
          </button>

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden sm:block">
          <form action="#" method="POST">
            <div className="relative font-bold text-black">
              {employee?.position !== "admin" && (
                <select
                  value={selectedWarehouse || ""}
                  onChange={handleWarehouseChange}
                  className="rounded-md border px-4 py-2"
                  disabled
                >
                  <option value="" disabled>
                    Chủ kho
                  </option>
                  {Array.isArray(warehouses) && warehouses.length > 0 ? (
                    warehouses.map((warehouse: any) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.warehouseName} - MK000{warehouse.id}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Không có kho nào
                    </option>
                  )}
                </select>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />

            {/* Notification Menu Area */}
            <DropdownNotification />
          </ul>

          {/* User Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
