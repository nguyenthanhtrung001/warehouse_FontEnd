import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import { useEmployeeStore } from '@/stores/employeeStore';

const ChatCard = () => {
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [top, setTop] = useState<number>(5); // Mặc định chọn 5
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!employee || !employee.warehouseId) return;
      try {
        const response = await axiosInstance.get(`${API_ROUTES.TOP_LOWEST_PRODUCTS(top,employee?.warehouseId)}`);
        const data = response.data;
        const formattedData: Chat[] = data.map((product: any) => ({
          avatar: product.image ? product.image : "/images/product/product-01.png",
          name: product.productName,
          text: product.productGroup.groupName,
          textCount: product.quantity,
        }));
        setChatData(formattedData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [top,employee] );

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Hàng hóa tồn kho thấp
      </h4>

      {/* Dropdown để chọn số lượng */}
      <div className="mb-4 px-7.5">
        <label htmlFor="top" className="mr-2">Chọn số lượng:</label>
        <select
          id="top"
          value={top}
          onChange={(e) => setTop(parseInt(e.target.value, 10))}
          className="border rounded p-2"
        >
          {Array(10).fill(null).map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <Link href="/receipts/add" className="text-blue-700 ml-12">Nhập hàng ngay</Link>
      </div>

      <div>
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                src={chat.avatar}
                layout="fill"
                className="rounded-full"
                alt="Product"
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`
                }`}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.text}
                  </span>
                  <span className="text-xs"> {chat.time}</span>
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
