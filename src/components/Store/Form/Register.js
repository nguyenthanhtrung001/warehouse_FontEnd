"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios'; // Import Axios

const SignupForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhone = (phone) => {
    if (phone.startsWith('0') && phone.length === 10) {
      return true;
    } else if (phone.startsWith('84') && phone.length === 11) {
      return true;
    }
    return false;
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/; // Regular expression to check for letters and spaces only
    return regex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, phone, name } = formData;
    const newErrors = {};

    if (!validatePhone(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ. Nếu bắt đầu bằng '0', số điện thoại phải có 10 chữ số. Nếu bắt đầu bằng '84', số điện thoại phải có 11 chữ số.";
    }

    if (!validateName(name)) {
      newErrors.name = "Họ và tên chỉ chứa ký tự chữ cái và không có ký tự đặc biệt.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Gọi API gửi dữ liệu bằng Axios
    try {
      const response = await axios.post('http://localhost:8888/v1/identity/users/registration', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Bạn đã đăng ký tài khoản thành công!',
        confirmButtonText: 'OK',
      });

      console.log('Đăng ký thành công:', response.data);

      // Xóa dữ liệu biểu mẫu sau khi thành công
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrors({ form: 'Có lỗi xảy ra, vui lòng thử lại.' }); // Hiển thị thông báo lỗi

      // Hiển thị thông báo lỗi
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Vui lòng thử lại sau.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <section className="signup-form my-8 pl-8 pr-8 pt-2 bg-white rounded-lg border border-gray-100 ">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Đăng ký tài khoản mới</h2>
      {errors.form && <p className="text-red text-center">{errors.form}</p>} {/* Hiển thị thông báo lỗi toàn bộ biểu mẫu */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">Họ và tên</label>
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nhập họ và tên"
            />
            {errors.name && <p className="text-red text-xs italic">{errors.name}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập email của bạn"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phone">Số điện thoại</label>
          <div className="relative">
            <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="text-red text-xs italic">{errors.phone}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">Mật khẩu</label>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập mật khẩu"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-700 transition duration-300"
          >
            Đăng ký
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Bạn đã có tài khoản? <a href="/inventory/login" className="text-green-800 hover:underline">Đăng nhập tại đây</a>
        </p>
      </form>
    </section>
  );
};

export default SignupForm;
