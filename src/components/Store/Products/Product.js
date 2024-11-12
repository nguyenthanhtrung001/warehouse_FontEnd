"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import useProductStore from '@/components/Store/Zustands/useProductStore'; // Import Zustand store
import Image from 'next/image'; // Import Image from next/image
import Cookies from 'js-cookie'; // Import js-cookie
import Swal from 'sweetalert2'; // Import SweetAlert2
import styles from './ProductDetail.module.css'; // Nhập CSS module
import { FaShoppingCart, FaCheck, FaTimes, FaTags, FaInfoCircle } from 'react-icons/fa'; // Import icon từ react-icons
import { decrypt } from '@/utils/cryptoUtils'; // Nhập hàm giải mã


const ProductDetail = () => {
  const [addedToCart, setAddedToCart] = useState(false); // Trạng thái để theo dõi hiệu ứng
  const router = useRouter();
  const { selectedProduct } = useProductStore(); // Lấy sản phẩm từ Zustand store
  const [customerId, setCustomerId] = useState(null); // Lưu ID khách hàng

  // Kiểm tra thông tin khách hàng từ localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer));
        setCustomerId(decryptedCustomer.id); // Lưu ID khách hàng vào state
      } catch (error) {
        console.error('Failed to decrypt customer data:', error);
      }
    }
  }, []); // Chỉ chạy 1 lần khi component được mount

  // Kiểm tra nếu không có sản phẩm nào được chọn, điều hướng người dùng quay lại trang sản phẩm
  useEffect(() => {
    if (!selectedProduct) {
      router.push("/inventory/products"); // Điều hướng về trang danh sách sản phẩm nếu không có sản phẩm nào được chọn
    }
  }, [selectedProduct, router]);

  // Nếu chưa có sản phẩm, không hiển thị gì (hoặc hiển thị loading)
  if (!selectedProduct) {
    return <div>Loading...</div>;
  }

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = () => {
    const cartKey = `user_cart_${customerId}`;  // Key riêng cho khách hàng
    const existingCart = Cookies.get(cartKey) ? JSON.parse(Cookies.get(cartKey)) : [];

    // Tìm sản phẩm đã có trong giỏ hàng
    const existingProduct = existingCart.find(item => item.id === selectedProduct.id);
    
    if (existingProduct) {
      // Nếu sản phẩm đã có, cộng thêm 1 vào số lượng nếu chưa vượt quá quantity
      const newQuantity = Math.min(existingProduct.quantity + 1, selectedProduct.quantity);
      
      // Cập nhật số lượng trong giỏ hàng
      existingProduct.quantity = newQuantity;

      // Cập nhật lại giỏ hàng
      Cookies.set(cartKey, JSON.stringify(existingCart), { expires: 7 });
    } else {
      // Nếu chưa có, thêm sản phẩm mới với số lượng 1
      const newProduct = { ...selectedProduct, quantity: 1 };
      // Thêm sản phẩm vào giỏ hàng
      existingCart.push(newProduct);
      Cookies.set(cartKey, JSON.stringify(existingCart), { expires: 7 });
    }

    setAddedToCart(true); // Đặt trạng thái thêm vào giỏ hàng
    Swal.fire({
      title: 'Thành công!',
      text: 'Sản phẩm đã được thêm vào giỏ hàng!',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    // Xóa hiệu ứng sau một khoảng thời gian
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000); // Thời gian hiệu ứng (2 giây)
  };

  // Hiển thị chi tiết sản phẩm nếu có
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold my-4">{selectedProduct.name}</h1>
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Hình ảnh sản phẩm */}
        <div className="w-full md:w-1/2">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            width={500} // Chỉnh sửa chiều rộng mong muốn
            height={500} // Chỉnh sửa chiều cao mong muốn
            className="w-full h-auto max-h-96 object-contain transition-transform transform hover:scale-105"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            {/* Hiển thị tên thương hiệu (brandName) thay vì toàn bộ đối tượng brand */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              <FaTags className="inline mr-2" />
              {selectedProduct.brand.brandName}
            </h2>
            <p className="text-2xl text-green-600 font-bold mt-2">
              <FaShoppingCart className="inline mr-2" />
              Giá: {selectedProduct.price.toLocaleString()}đ
            </p>
            <div className="flex items-center mt-4">
              {/* Biểu tượng còn hàng */}
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold leading-5 text-white rounded-full ${selectedProduct.quantity > 0 ? 'bg-green-500' : 'bg-red'}`}>
                {selectedProduct.quantity > 0 ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                {selectedProduct.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
            <p className="mt-4 text-gray-700">{selectedProduct.description}</p>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">
                <FaInfoCircle className="inline mr-2" />
                Chi tiết sản phẩm:
              </h3>
              <ul className="list-disc pl-5 mt-2 text-gray-600">
                <li>Nhóm hàng: {selectedProduct.productGroup.groupName}</li>
                <li>Thương hiệu: {selectedProduct.brand.brandName}</li>
                <li>Tồn kho: {selectedProduct.quantity}</li>
                {/* Thêm các chi tiết khác nếu cần */}
              </ul>
            </div>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button 
            className={`${styles.button} ${addedToCart ? styles.added : ''} ${selectedProduct.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={handleAddToCart}
            disabled={selectedProduct.quantity === 0} // Vô hiệu hóa nút nếu hết hàng
          >
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l1 5h12l1-5h2M7 10h14M5 10l1 5h12l1-5H5z"
                />
              </svg>
              {addedToCart ? "Đã thêm!" : "Thêm vào giỏ hàng"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
