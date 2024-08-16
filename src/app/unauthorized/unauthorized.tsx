// src/pages/unauthorized.tsx

import { FC } from 'react';
import Link from 'next/link';

const Unauthorized: FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" 
    style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg text-center z-10">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.93-1.28a6.99 6.99 0 010-10.43m13.85 0a6.99 6.99 0 010 10.43M3.5 13.5A8.97 8.97 0 012 12a8.97 8.97 0 011.5-1.5m16 0A8.97 8.97 0 0122 12a8.97 8.97 0 01-1.5 1.5M12 2a10 10 0 0110 10m-10-10a10 10 0 00-10 10m10-10V4m0 0a6 6 0 00-6 6m0 0a6 6 0 006 6m0-12a6 6 0 016 6m-6 0a6 6 0 00-6 6m0-12v2" />
        </svg>
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">403 - Không Có Quyền Truy Cập</h1>
        <p className="text-lg text-gray-600 mb-6">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn nghĩ rằng đây là lỗi.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 ease-in-out"
        >
          Quay lại trang chính
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
