"use client";
// src/components/FormElements/employee/UpdateEmployeeForm.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import { Employee } from '@/types/employee';
import Swal from 'sweetalert2';

interface UpdateEmployeeFormProps {
  employee?: Employee | null;
  isUpdate: boolean;
}

const UpdateEmployeeForm: React.FC<UpdateEmployeeFormProps> = ({ employee, isUpdate }) => {
  const [formData, setFormData] = useState({
    id: '',
    employeeName: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: '',
    dateJoined: '',
    email: '',
    address: '',
    position: '',
    status: 1,
    basicSalary: 0,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        id: employee.id.toString(),
        dateOfBirth: new Date(employee.dateOfBirth).toISOString().split('T')[0], // Đảm bảo định dạng ngày
        dateJoined: new Date(employee.dateJoined).toISOString().split('T')[0], // Đảm bảo định dạng ngày
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirm the action with the user
    const confirmation = await Swal.fire({
      title: 'Xác nhận',
      text: isUpdate ? 'Bạn có chắc muốn cập nhật thông tin nhân viên không?' : 'Bạn có chắc muốn thêm nhân viên mới không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, tiếp tục!',
      cancelButtonText: 'Không, hủy bỏ!',
    });

    if (confirmation.isConfirmed) {
      try {
        const payload = {
          ...formData,
          id: parseInt(formData.id, 10), // Chuyển đổi id về số khi gửi lên API
        };

        if (isUpdate && employee?.id !== undefined) {
          await axiosInstance.put(API_ROUTES.EMPLOYEE_DETAILS(employee.id), payload);
        } else {
          await axiosInstance.post(API_ROUTES.EMPLOYEES, payload);
        }

        // Show success notification
        Swal.fire({
          title: 'Thành công!',
          text: isUpdate ? 'Thông tin nhân viên đã được cập nhật.' : 'Nhân viên mới đã được thêm.',
          icon: 'success',
        });

        // Cập nhật lại danh sách nhân viên sau khi thêm hoặc cập nhật thành công
        window.location.reload(); // Tải lại trang sau khi cập nhật hoặc thêm thành công
      } catch (error) {
        // Show error notification
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi xử lý thông tin. Vui lòng thử lại.',
          icon: 'error',
        });
        console.error("Error submitting form: ", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 text-black">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên nhân viên</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
          <input
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lương cơ bản</label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Ngừng hoạt động</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isUpdate ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        </button>
      </div>
    </form>
  );
};

export default UpdateEmployeeForm;
