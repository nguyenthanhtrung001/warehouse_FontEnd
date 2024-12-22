"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import SearchInput from "@/components/Search/SearchInputProps";
import API_ROUTES from "@/utils/apiRoutes";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import Image from "next/image";
import { useEmployeeStore } from "@/stores/employeeStore";
import PriceHistory from "./PriceHistory"; // Import trang lịch sử cập nhật giá


const TableProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number | null>(null);
  const { employee } = useEmployeeStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Adjust items per page as needed

  // Modal state for price history
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS);
        const productList = await Promise.all(
          response.data.map(async (item: any) => ({
            id: item.id,
            image: item.image ? item.image : "/images/product/product-01.png",
            productName: item.productName,
            category: item.productGroup
              ? item.productGroup.groupName
              : "Unknown",
            brandName: item.brand ? item.brand.brandName : "Unknown",
            price: item.price,
            sold: item.quantity,
            profit: 0,
            description: item.description,
            weight: item.weight,
          })),
        );
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const productName = product.productName || "";
      const brandName = product.brandName || "";
      const category = product.category || "";
      return (
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  }, [searchTerm, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number,
  ) => {
    setEditedPrice(Number(e.target.value));
    setEditingProductId(productId);
  };

  const handlePriceBlur = async (productId: number) => {
    if (editingProductId === productId && editedPrice !== null) {
      try {
        const confirmResult = await Swal.fire({
          title: "Xác nhận",
          text: "Bạn có chắc chắn muốn cập nhật giá sản phẩm này?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Có, cập nhật",
          cancelButtonText: "Hủy",
        });
        if (confirmResult.isConfirmed) {
        const updatedProduct = products.map((product) =>
          product.id === productId
            ? { ...product, price: editedPrice }
            : product,
        );

        await axiosInstance.post(`http://localhost:8888/v1/api/prices`, {
          price: editedPrice,
          productId: productId,
          employeeId: employee?.id,
        });
        setProducts(updatedProduct);
        setEditingProductId(null);
        setEditedPrice(null);
        Swal.fire({
          title: "Thành công!",
          text: "Đã cập nhật giá sản phẩm thành công",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      } catch (error) {
        Swal.fire({
          title: "Thất bại!",
          text: "Lỗi: Không thể cập nhật giá sản phẩm",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating product price: ", error);
      }
    }
    
  
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="mt-1 text-3xl font-semibold text-black dark:text-white">
              CẬP NHẬT GIÁ
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã sản phẩm"
            />
          </div>
          <div className="col-span-3 flex justify-end">
            <button
              onClick={openModal}
              className="rounded bg-blue-700 px-4 py-2 text-white"
            >
              Xem lịch sử cập nhật giá
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Price History */}
      {/* Modal for Price History */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-12">
    <div className="relative w-3/4 max-w-4xl mx-auto my-auto rounded-lg bg-white p-6 shadow-lg overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Lịch sử cập nhật giá</h2>
        <button
          onClick={closeModal}
          className="text-lg font-bold text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>
      <PriceHistory /> {/* Component chứa dữ liệu lịch sử */}
    </div>
  </div>
)}


      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white">
          <div className="col-span-4 ml-6 font-medium">Tên mặt hàng</div>
          <div className="col-span-2 font-medium">Nhóm hàng</div>
          <div className="col-span-2 font-medium">Thương hiệu</div>
          <div className="col-span-2 font-medium">Giá hiện tại</div>
          <div className="col-span-2 font-medium">Giá mới</div>
        </div>
      </div>

      {currentItems.map((product) => (
        <div
          key={product.id}
          className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CheckboxTwo />
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={product.image}
                  alt="Product"
                  width={60}
                  height={50}
                  className="h-12.5 w-15"
                />
              </div>
              <p className="mr-3 text-sm text-black dark:text-white">
                {product.productName}
              </p>
            </div>
            <div className="col-span-2">
              <p className="mt-2 text-sm text-black dark:text-white">
                {product.category}
              </p>
            </div>
            <div className="col-span-2">
              <p className="mt-2 text-sm text-black dark:text-white">
                {product.brandName}
              </p>
            </div>
            <div className="col-span-2">
              <p className="mt-2 text-sm text-black dark:text-white">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={
                  editingProductId === product.id
                    ? editedPrice || ""
                    : product.price
                }
                onChange={(e) => handlePriceChange(e, product.id)}
                onBlur={() => handlePriceBlur(product.id)}
                className="border-gray-300 h-8 w-32 rounded border p-1" // Thay đổi lớp w-24 và h-8 theo kích thước mong muốn
                placeholder="Nhập giá mới"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between px-4 py-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="rounded border px-3 py-1"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded border px-3 py-1"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default TableProduct;
