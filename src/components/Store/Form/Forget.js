"use client";
import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Xử lý logic gửi email để đặt lại mật khẩu
    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }

    // Giả lập xử lý gửi email
    console.log('Yêu cầu đặt lại mật khẩu được gửi tới:', email);
    setMessage('Một liên kết đặt lại mật khẩu đã được gửi tới email của bạn.');
    setEmail('');
    setError('');
  };

  return (
    <section className="forgot-password my-8 bg-white p-10 rounded-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Quên Mật Khẩu</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="mb-4 relative"> {/* Thêm lớp relative cho vị trí icon */}
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <i className="fa fa-envelope absolute left-3 top-10 text-gray-400" aria-hidden="true"></i> {/* Icon email */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`} // Tăng padding cho trường nhập
            placeholder="Nhập email của bạn"
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>} {/* Hiển thị thông báo lỗi */}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-700 transition duration-300"
          >
            Gửi yêu cầu đặt lại mật khẩu
          </button>
        </div>

        {message && <p className="mt-4 text-green-600 text-sm text-center">{message}</p>} {/* Hiển thị thông báo thành công */}
      </form>
    </section>
  );
};

export default ForgotPassword;
