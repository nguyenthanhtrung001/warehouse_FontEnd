import { useEffect, useState } from "react";
import { BRAND } from "@/types/brand";
import Image from "next/image";
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';

const TableOne = () => {
  const [brands, setBrands] = useState<BRAND[]>([]);
  const [selectedTop, setSelectedTop] = useState<number>(3);

  useEffect(() => {
    fetchData(selectedTop);
  }, [selectedTop]);

  const fetchData = async (top: number) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.TOP_SALE_PRODUCTS}?top=${top}`);
      const data: BRAND[] = response.data;
      setBrands(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setSelectedTop(value);
  };

  const formatCurrency = (value: number | null) => {
    return value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ?? "N/A";
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top hàng hóa
      </h4>

      <div className="mb-4">
        <label htmlFor="top-select" className="mr-2 text-xl font-medium text-black dark:text-white">
          Chọn số lượng sản phẩm:
        </label>
        <select
          id="top-select"
          className="border border-gray-300 p-2"
          value={selectedTop}
          onChange={handleSelectChange}
        >
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mặt hàng
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Thương hiệu
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nhóm hàng
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Giá bán
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Số lượng bán
            </h5>
          </div>
        </div>

        {brands && Array.isArray(brands) && brands.map((brand, key) =>  (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === brands.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                {brand.image ? (
                  <Image src={brand.image} alt={brand.productName} width={48} height={48} />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 flex items-center justify-center">
                    <Image src='/images/product/product-01.png' alt={brand.productName} width={48} height={48} />
                  </div>
                )}
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {brand.productName}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.brand.brandName}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{brand.productGroup.groupName}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{formatCurrency(brand.price)}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{brand.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
