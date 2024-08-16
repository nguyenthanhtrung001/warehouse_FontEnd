"use client";
// src/components/FormElements/supplier/FormUpdateSupplier.tsx
import React, { useState, useEffect } from 'react';
import API_ROUTES from '@/utils/apiRoutes';
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import { Supplier } from '@/types/supplier';

interface FormUpdateSupplierProps {
  supplier: Supplier | null;
}

const FormUpdateSupplier: React.FC<FormUpdateSupplierProps> = ({ supplier }) => {
  const [formData, setFormData] = useState({
    id: '',
    supplierName: '',
    phoneNumber: '',
    address: '',
    email: '',
    note: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        id: supplier.id.toString(),
        supplierName: supplier.supplierName,
        phoneNumber: supplier.phoneNumber,
        address: supplier.address,
        email: supplier.email,
        note: supplier.note,
      });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Xác nhận trước khi gửi với Swal
    const isConfirmed = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn có muốn cập nhật nhà cung cấp này không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, cập nhật!',
      cancelButtonText: 'Hủy',
    });

    if (!isConfirmed.isConfirmed) return;

    try {
      const payload = {
        ...formData,
        id: parseInt(formData.id, 10),
      };

      await axiosInstance.put(`${API_ROUTES.SUPPLIERS}/${payload.id}`, payload);

      // Thông báo thành công với Swal
      await Swal.fire({
        title: 'Thành công!',
        text: 'Nhà cung cấp đã được cập nhật thành công!',
        icon: 'success',
      });

      // Bạn có thể thêm mã để cập nhật danh sách nhà cung cấp hoặc đóng modal tại đây
    } catch (error) {
      console.error("Error submitting form: ", error);

      // Thông báo thất bại với Swal
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi cập nhật nhà cung cấp.',
        icon: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
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
          className="focus:border-indigo-500 focus:outline-none mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-0"
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
          Cập nhật nhà cung cấp
        </button>
      </div>
    </form>
  );
};

export default FormUpdateSupplier;
