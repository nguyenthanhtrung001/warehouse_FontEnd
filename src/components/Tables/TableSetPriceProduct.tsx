"use client";
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import CheckboxTwo from '@/components/Checkboxes/CheckboxTwo';

import SearchInput from '@/components/Search/SearchInputProps';
import API_ROUTES from '@/utils/apiRoutes'; // Import URL từ apiRoutes.ts
import axiosInstance from '@/utils/axiosInstance';
import Swal from "sweetalert2";
import Image from 'next/image';
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';



const TableProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number | null>(null);
  const { employee } = useEmployeeStore();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS);
        const productList = await Promise.all(
          response.data.map(async (item: any) => {
            return {
              id: item.id,
              image: item.image?item.image:'/images/product/product-01.png',
              productName: item.productName,
              category: item.productGroup ? item.productGroup.groupName : 'Unknown',
              brandName: item.brand ? item.brand.brandName : 'Unknown',
              price: item.price,
              sold: item.quantity,
              profit: 0,
              description: item.description,
              weight: item.weight,
            };
          })
        );
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const productName = product.productName || '';
      const brandName = product.brandName || '';
      const category = product.category || '';
    
      return (
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    setEditedPrice(Number(e.target.value));
    setEditingProductId(productId);
  };

  const handlePriceBlur = async (productId: number) => {
    if (editingProductId === productId && editedPrice !== null) {
      try {
        const employeeId = 123; // Đặt ID của nhân viên ở đây
        const updatedProduct = products.map((product) =>
          product.id === productId ? { ...product, price: editedPrice } : product
        );
        await axiosInstance.post(`http://localhost:8888/v1/api/prices`, {
          price: editedPrice,
          productId: productId,
          employeeId: employee?.id||1,
        });
        setProducts(updatedProduct);
        setEditingProductId(null);
        setEditedPrice(null);
        Swal.fire({
          title: "Thành công!",
          text: "Đã cập nhật giá sản phẩm thành công",
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (error) {
        Swal.fire({
          title: "Thất bại!",
          text: "Lỗi: Không thể cập nhật giá sản phẩm",
          icon: "error",
          confirmButtonText: "OK"
        });
        console.error('Error updating product price: ', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white mt-1">
              CẬP NHẬT GIÁ
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
          <div className="col-span-1 px-1"></div>
         
        </div>
      </div>

    

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold">
          <div className="col-span-4 font-medium ml-6">Tên mặt hàng</div>
          <div className="col-span-2 font-medium">Nhóm hàng</div>
          <div className="col-span-2 font-medium">Thương hiệu</div>
         
          <div className="col-span-2 font-medium">Giá hiện tại</div>
          <div className="col-span-2 font-medium">Giá mới</div>
        </div>
      </div>

      {filteredProducts.map((product) => (
        <div key={product.id} className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1">
          <div className="grid grid-cols-12 gap-4">
            <div
              className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <CheckboxTwo />
              <div className="h-12.5 w-15 rounded-md">
              <Image
                  src={product.image}
                  alt="Product"
                  width={60} // Adjust the width according to your needs
                  height={50} // Adjust the height according to your needs
                  className="w-15 h-12.5"
                />
              </div>
              <p className="text-sm text-black dark:text-white mr-3">{product.productName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-black dark:text-white mt-2">{product.category}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-black dark:text-white mt-2">{product.brandName}</p>
            </div>
           
            <div className="col-span-2">
              <p className="text-sm text-black dark:text-white mt-2">{formatCurrency(product.price)}</p>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={editingProductId === product.id ? editedPrice || '' : product.price}
                onChange={(e) => handlePriceChange(e, product.id)}
                onBlur={() => handlePriceBlur(product.id)}
                className="border border-gray-300 p-1 rounded"
                placeholder="Nhập giá mới"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableProduct;
