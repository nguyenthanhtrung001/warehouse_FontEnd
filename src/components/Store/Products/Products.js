"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Brands from "./Brands";
import Categories from "./Categories";
import { motion } from "framer-motion"; // Import framer-motion
import { useRouter } from 'next/navigation'; 
import useProductStore from '@/components/Store/Zustands/useProductStore'; // Import Zustand store
import Image from 'next/image'; // Import Image từ next/image
import { FaCartPlus, FaSearch } from 'react-icons/fa'; // Nhập biểu tượng

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const { products, setProducts, setSelectedProduct } = useProductStore(); // Sử dụng Zustand store
  const router = useRouter();

  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/products");
        setProducts(response.data); // Đặt sản phẩm vào Zustand store
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const filteredProducts = products.filter((product) =>
    (selectedBrands.length ? selectedBrands.includes(product.brand.brandName) : true) &&
    (selectedCategories.length ? selectedCategories.includes(product.productGroup.groupName) : true) &&
    (searchQuery ? product.productName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Lưu sản phẩm vào Zustand store
    router.push("/inventory/products/id"); // Điều hướng đến trang chi tiết sản phẩm
  };

  const handleAddToCart = (product) => {
    // Giả sử bạn có hàm thêm vào giỏ hàng
    console.log("Đã thêm vào giỏ hàng:", product);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-4">Danh sách sản phẩm</h1>

      {/* Button ẩn/hiện bộ lọc */}
      <div className="text-center mb-4 flex justify-end">
        <motion.button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 flex items-center justify-center"
          onClick={() => setShowFilter(!showFilter)}
          whileHover={{ scale: 1.05 }} // Hiệu ứng phóng to khi hover
          transition={{ type: "spring", stiffness: 300 }}
        >
          {showFilter ? "Ẩn Bộ Lọc" : "Hiện Bộ Lọc"}
          <FaSearch className="ml-2" /> {/* Biểu tượng tìm kiếm */}
        </motion.button>
      </div>

      {/* Bộ lọc sản phẩm */}
      {showFilter && (
        <motion.div 
          className="filter-section bg-gray-100 p-4 rounded-md shadow-lg mb-6"
          initial={{ opacity: 0 }} // Khởi đầu với độ trong suốt 0
          animate={{ opacity: 1 }} // Hoạt ảnh tăng độ trong suốt lên 1
          exit={{ opacity: 0 }} // Khi ẩn thì giảm độ trong suốt xuống 0
          transition={{ duration: 0.3 }} // Thời gian hiệu ứng
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Brands selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} />
            <Categories selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div>
              <h2 className="font-semibold mb-2">Tìm kiếm:</h2>
              <div className="flex items-center border rounded">
                <FaSearch className="ml-2" /> {/* Biểu tượng tìm kiếm */}
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="border-none p-2 w-full focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <motion.div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }} // Hiệu ứng phóng to khi hover
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleProductClick(product)} // Điều hướng bằng cách lưu sản phẩm vào Zustand
          >
            <Image
              src={product.image}
              alt={product.productName}
              width={500} // Chỉnh sửa chiều rộng mong muốn
              height={500} // Chỉnh sửa chiều cao mong muốn
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{product.productName}</h3>
              <p>Giá: {product.price.toLocaleString()}đ</p>
              <p>Hãng: {product.brand.brandName}</p>
              <p>Nhóm hàng: {product.productGroup.groupName}</p>
              <motion.button
                className="bg-green-800 text-white px-4 py-2 rounded mt-2 w-full flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }} // Hiệu ứng phóng to và dịch chuyển lên khi hover
                transition={{ type: "spring", stiffness: 300 }}
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn điều hướng khi bấm nút
                  handleAddToCart(product); // Xử lý thêm vào giỏ hàng
                }}
              >
                <FaCartPlus className="mr-2" /> {/* Biểu tượng giỏ hàng */}
                Thêm vào giỏ hàng
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <motion.button
            className={`px-4 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Trước
          </motion.button>
          <span className="mx-4">Trang {currentPage} / {totalPages}</span>
          <motion.button
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Sau
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
