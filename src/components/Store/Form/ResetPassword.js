"use client";
import React, { useState } from 'react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Kiểm tra ràng buộc mật khẩu
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    // Giả lập xử lý thay đổi mật khẩu
    // Bạn có thể thay thế phần này bằng logic API thực tế
    console.log('Thay đổi mật khẩu thành công với:', {
      currentPassword,
      newPassword,
    });
    setMessage('Mật khẩu đã được thay đổi thành công.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <section className="change-password my-8">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Thay Đổi Mật Khẩu</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="current-password">Mật khẩu hiện tại</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="new-password">Mật khẩu mới</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
            placeholder="Xác nhận mật khẩu mới"
          />
        </div>

        {error && <p className="text-red text-xs italic mb-4">{error}</p>} {/* Hiển thị thông báo lỗi */}
        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>} {/* Hiển thị thông báo thành công */}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-700 transition duration-300"
          >
            Thay đổi mật khẩu
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePassword;
