import React from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaFileContract, FaHeadset } from 'react-icons/fa'; // Thêm các icon từ react-icons

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-center mb-4">© 2024 Your Company</p>
        <ul className="flex space-x-6 text-lg">
          <li className="flex items-center space-x-2">
            <FaShieldAlt /> {/* Icon cho Chính sách bảo mật */}
            <Link href="/inventory/about-us" className="hover:underline">
              Chính sách bảo mật
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <FaFileContract /> {/* Icon cho Điều khoản dịch vụ */}
            <Link href="#" className="hover:underline">
              Điều khoản dịch vụ
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <FaHeadset /> {/* Icon cho Hỗ trợ khách hàng */}
            <Link href="#" className="hover:underline">
              Hỗ trợ khách hàng
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
