"use client";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FaShoppingCart, FaStar } from 'react-icons/fa'; // Nhập biểu tượng

const products = [
  { id: 1, name: 'Sản phẩm 1', price: '500.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5' },
  { id: 2, name: 'Sản phẩm 2', price: '300.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5' },
  { id: 3, name: 'Sản phẩm 3', price: '700.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5' },
  { id: 4, name: 'Sản phẩm 4', price: '450.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5g' },
  { id: 5, name: 'Sản phẩm 5', price: '450.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5g' },
  { id: 6, name: 'Sản phẩm 6', price: '450.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5g' },
  { id: 7, name: 'Sản phẩm 7', price: '700.000đ', image: 'https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5' },
];

const MainContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/product-groups");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero bg-green-800 text-white p-8 text-center">
        <h1 className="text-4xl font-bold">Đặt mua sản phẩm dễ dàng</h1>
        <p className="my-4">Khám phá kho sản phẩm đa dạng của chúng tôi ngay bây giờ!</p>
        <button className="bg-white text-green-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-300">Xem sản phẩm ngay</button>
      </section>

      {/* Categories Section */}
      <section className="categories my-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Nhóm sản phẩm</h2>
        <div className="flex justify-center space-x-4 flex-wrap">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-4 bg-gray-100 shadow hover:bg-green-200 transition duration-300 transform hover:scale-105">
              <h3 className="font-bold">{category.groupName}</h3>
              <button className="mt-2 bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700 transition duration-300">Xem sản phẩm</button>
            </div>
          ))}
        </div>
      </section>

      {/* Slider Section */}
      <section className="slider my-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Sản phẩm bán chạy</h2>
        <div className="flex overflow-x-auto space-x-6 p-4">
          {[
            { id: 1, name: "Bán chạy 1", image: "https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5" },
            { id: 2, name: "Bán chạy 2", image: "https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5" },
            { id: 3, name: "Bán chạy 3", image: "https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5" },
            { id: 4, name: "Bán chạy 4", image: "https://firebasestorage.googleapis.com/v0/b/wasehouse-1d975.appspot.com/o/images%2Fpremium?alt=media&token=9c579ee8-688f-4999-aa60-f0b7d6a0b7a5" },
          ].map((product) => (
            <div key={product.id} className="flex-none w-72 bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-80" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-center">{product.name}</h3>
                <button className="bg-green-800 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition duration-300 w-full">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products my-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Sản phẩm nổi bật</h2>
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {currentProducts.slice(0, 6).map((product) => (
            <div key={product.id} className="product-card border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              <img src={product.image} alt={product.name} className="w-full h-48 object-contain transition-opacity duration-300 hover:opacity-80 hover:scale-110" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-center mb-2">{product.name}</h3>
                <p className="text-center text-gray-700 mb-2">Giá: <span className="font-semibold text-green-800">{product.price}</span></p>
                <button className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 w-full flex items-center justify-center">
                  <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-green-800 text-white hover:bg-green-700 transition duration-300'}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="mx-4 text-lg">Trang {currentPage} / {totalPages}</span>
          <button
            className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-green-800 text-white hover:bg-green-700 transition duration-300'}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
