"use client";
// src/components/FormElements/supplier/FormAddSupplier.tsx
import React, { useState } from 'react';
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2';


const FormAddSupplier: React.FC = () => {
  const initialFormData = {
    id: '',
    supplierName: '',
    phoneNumber: '',
    address: '',
    email: '',
    note: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Xác nhận trước khi gửi với Swal
    const isConfirmed = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn có muốn thêm nhà cung cấp này không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, thêm!',
      cancelButtonText: 'Hủy',
    });

    if (!isConfirmed.isConfirmed) return;

    try {
      const payload = {
        ...formData,
        id: parseInt(formData.id, 10), // Chuyển đổi id về số khi gửi lên API
      };

      await axiosInstance.post(API_ROUTES.SUPPLIERS, payload);

      // Thông báo thành công với Swal
      await Swal.fire({
        title: 'Thành công!',
        text: 'Nhà cung cấp đã được thêm thành công!',
        icon: 'success',
      });

      // Xóa dữ liệu form sau khi thêm thành công
      setFormData(initialFormData);

      // Bạn có thể thêm mã để cập nhật danh sách nhà cung cấp hoặc đóng modal tại đây
    } catch (error) {
      console.error("Error submitting form: ", error);

      // Thông báo thất bại với Swal
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi thêm nhà cung cấp.',
        icon: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black ">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
        <input
          type="text"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-500 rounded-md shadow-sm sm:text-sm focus:ring-0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className=" focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-0"
        ></textarea>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Thêm nhà cung cấp
        </button>
      </div>
    </form>
  );
};

export default FormAddSupplier;
