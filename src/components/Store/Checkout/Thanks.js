"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaShoppingCart, FaClipboardCheck, FaTruck, FaHome } from 'react-icons/fa';

const ThankYou = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        {/* Icon cảm ơn */}
        <div className="flex justify-center items-center mb-4">
          <FaCheckCircle className="text-green-500 text-7xl" />
        </div>

        {/* Tiêu đề */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Cảm ơn bạn!</h1>

        {/* Thông báo */}
        <p className="text-lg text-gray-700 mb-6">
          Đơn hàng của bạn đã được đặt thành công và chúng tôi sẽ sớm xử lý.
        </p>

        {/* Thông tin bổ sung */}
        <div className="bg-green-50 p-4 rounded-lg shadow-inner mb-8">
          <p className="text-green-700 font-semibold">
            Bạn sẽ nhận được email xác nhận với thông tin chi tiết về đơn hàng trong giây lát.
          </p>
        </div>

        {/* Thanh trạng thái đơn hàng */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Trạng thái đơn hàng:</h2>
          <div className="flex items-center justify-between text-sm">
            <div className="w-1/4 flex flex-col items-center text-gray-600">
              <FaShoppingCart className="text-2xl mb-1" />
              Đặt hàng
            </div>
            <div className="w-1/4 flex flex-col items-center text-gray-600">
              <FaClipboardCheck className="text-2xl mb-1" />
              Xác nhận
            </div>
            <div className="w-1/4 flex flex-col items-center text-gray-600">
              <FaTruck className="text-2xl mb-1" />
              Đang vận chuyển
            </div>
            <div className="w-1/4 flex flex-col items-center text-gray-600">
              <FaHome className="text-2xl mb-1" />
              Giao hàng
            </div>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full mt-2 mb-4">
            <div className="bg-green-600 h-2 rounded-full w-1/4"></div>
          </div>
        </div>

        {/* Nút quay về trang chủ */}
        <button
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors duration-300"
          onClick={handleGoHome}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
