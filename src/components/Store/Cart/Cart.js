"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Import useRouter
import { decrypt } from '@/utils/cryptoUtils'; // Nhập hàm giải mã

const Cart = () => {
  const [items, setItems] = useState([]);
  const [customerId, setCustomerId] = useState(null); // Thêm state để lưu ID khách hàng
  const router = useRouter(); // Khởi tạo useRouter

  // Kiểm tra thông tin khách hàng từ localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer)); // Hàm decrypt cần được định nghĩa
        setCustomerId(decryptedCustomer.id); // Lưu ID khách hàng vào state
      } catch (error) {
        console.error('Failed to decrypt customer data:', error);
      }
    }
  }, []); // Chỉ chạy 1 lần khi component được mount

  // Lấy dữ liệu giỏ hàng từ cookie dựa trên ID khách hàng
  useEffect(() => {
    if (customerId) {
      const cartKey = `user_cart_${customerId}`; // Tạo key cho giỏ hàng
      const cartData = Cookies.get(cartKey); // Lấy dữ liệu giỏ hàng từ cookie

      if (cartData) {
        const parsedData = JSON.parse(cartData); // Chuyển đổi chuỗi JSON thành mảng đối tượng
        setItems(parsedData);
      }
    }
  }, [customerId]); // Chạy lại khi customerId thay đổi

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (id, newQuantity) => {
    const quantity = Math.max(1, Number(newQuantity)); // Đảm bảo số lượng không nhỏ hơn 1

    setItems((prevItems) => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      return updatedItems; // Trả về giỏ hàng đã được cập nhật
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      return updatedItems; // Trả về giỏ hàng đã được cập nhật
    });
  };

  // Tính tổng tiền
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Cập nhật cookie khi giỏ hàng thay đổi
  useEffect(() => {
    if (customerId) {
      const cartKey = `user_cart_${customerId}`;
      if (items.length > 0) {
        Cookies.set(cartKey, JSON.stringify(items), { expires: 7 }); // Cập nhật cookie khi có sản phẩm
      } else {
        Cookies.remove(cartKey); // Xóa cookie nếu giỏ hàng trống
      }
    }
  }, [items, customerId]);

  // Hàm chuyển đến trang thanh toán
  const handleCheckout = () => {
    router.push('/inventory/cart/checkout'); // Điều hướng đến trang thanh toán
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Giỏ Hàng Của Bạn</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống!</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded" />
                <div className="ml-4">
                  <h2 className="font-bold">{item.productName}</h2>
                  <p className="text-gray-600">Giá: {item.price.toLocaleString()}đ</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    className="border rounded p-1 w-16 mt-2"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">Thành tiền: {(item.price * item.quantity).toLocaleString()}đ</p>
                <button
                  className="text-red-600 hover:underline mt-2"
                  onClick={() => removeItem(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-bold">Tổng tiền:</h2>
        <p className="text-xl">{totalAmount.toLocaleString()}đ</p>
      </div>

      <div className="text-center my-4 flex justify-end">
        <button 
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300" 
          onClick={handleCheckout} // Gọi hàm handleCheckout khi nhấn nút
        >
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
