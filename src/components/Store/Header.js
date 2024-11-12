import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";// Thêm useRouter để thực hiện điều hướng
import { motion } from 'framer-motion';
import { FaBox, FaUser, FaShoppingCart, FaUserCircle, FaHistory, FaSignOutAlt } from 'react-icons/fa'; // Thêm icon Đăng xuất
import { decrypt } from '@/utils/cryptoUtils'; // Nhập hàm giải mã
import { FaWarehouse } from 'react-icons/fa';


const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Trạng thái để điều khiển dropdown
  const [customerName, setCustomerName] = useState(null); // Tên khách hàng
  const router = useRouter(); // Khởi tạo router

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen); // Thay đổi trạng thái dropdown
  };

  // Kiểm tra thông tin khách hàng từ localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer));
        setCustomerName(decryptedCustomer.customerName); // Lưu tên khách hàng vào state
      } catch (error) {
        console.error('Failed to decrypt customer data:', error);
      }
    }
  }, []);

  // Hàm xử lý chuyển hướng đến trang đăng nhập
  const handleLoginRedirect = () => {
    router.push('/inventory/login');
  };

  // Hàm xử lý chuyển hướng đến trang giỏ hàng
  const handleCartRedirect = () => {
    if (!customerName) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      handleLoginRedirect();
    } else {
      router.push('/inventory/cart'); // Nếu đã đăng nhập, chuyển đến giỏ hàng
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    Cookies.remove('authToken'); // Xóa token khỏi cookie
    localStorage.removeItem('customer'); // Xóa thông tin khách hàng
    setCustomerName(null); // Cập nhật state để xóa tên khách hàng
    router.push('/inventory'); // Điều hướng đến trang đăng nhập
    console.log("Đăng xuất thành công");
  };


  return (
    <header className="bg-green-800 text-white p-4 shadow-lg">
      <nav className="flex items-center justify-between container mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold flex items-center">
          <FaWarehouse className="mr-2" /> {/* Biểu tượng kho */}
          <Link href="/inventory">
            INVENTORY
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 rounded bg-white text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Menu điều hướng */}
        <ul className="flex space-x-6 text-lg">
          <li>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link href="/inventory/products" className="hover:underline flex items-center space-x-1">
                <FaBox /> {/* Icon sản phẩm */}
                <span>Sản phẩm</span>
              </Link>
            </motion.div>
          </li>

          {/* Mục Tài khoản */}
          <li>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} onClick={toggleDropdown}>
              <Link href={"#"} className="hover:underline flex items-center space-x-1" onClick={(e) => {
                if (!customerName) {
                  e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ Link
                  handleLoginRedirect(); // Chuyển đến trang đăng nhập nếu chưa đăng nhập

                }
              }}> <FaUser /> {/* Icon tài khoản */}
                <span>{customerName ? customerName : 'Đăng nhập'}</span> {/* Hiển thị tên người dùng hoặc 'Đăng nhập' */}
              </Link>
            </motion.div>
            {/* Dropdown menu chỉ hiển thị khi đã đăng nhập */}
            {isDropdownOpen && customerName && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-green-800 rounded-md shadow-lg z-10">
                <ul>
                  <li>
                    <Link href="/inventory/profile" className="flex items-center p-2 hover:bg-gray-100">
                      <FaUserCircle className="mr-2" /> {/* Icon profile */}
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/inventory/order-history" className="flex items-center p-2 hover:bg-gray-100">
                      <FaHistory className="mr-2" /> {/* Icon lịch sử đơn hàng */}
                      <span>Lịch sử đơn hàng</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center p-2 hover:bg-gray-100 w-full text-left">
                      <FaSignOutAlt className="mr-2" /> {/* Icon đăng xuất */}
                      <span>Đăng xuất</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Giỏ hàng */}
        <div className="ml-8">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} onClick={handleCartRedirect}>
            <Link href="#" className="bg-white text-green-800 rounded px-4 py-2 hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
              <FaShoppingCart /> {/* Icon giỏ hàng */}
              <span>Giỏ hàng</span>
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
