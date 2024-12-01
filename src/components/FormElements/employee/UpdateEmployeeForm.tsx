"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import { Employee } from '@/types/employee';
import Swal from 'sweetalert2';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUserTag, FaToggleOn } from 'react-icons/fa';

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
        dateOfBirth: new Date(employee.dateOfBirth).toISOString().split('T')[0],
        dateJoined: new Date(employee.dateJoined).toISOString().split('T')[0],
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          id: parseInt(formData.id, 10),
        };

        if (isUpdate && employee?.id !== undefined) {
          await axiosInstance.put(API_ROUTES.EMPLOYEE_DETAILS(employee.id), payload);
        } else {
          await axiosInstance.post(API_ROUTES.EMPLOYEES, payload);
        }

        Swal.fire({
          title: 'Thành công!',
          text: isUpdate ? 'Thông tin nhân viên đã được cập nhật.' : 'Nhân viên mới đã được thêm.',
          icon: 'success',
        });

        window.location.reload();
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi xử lý thông tin. Vui lòng thử lại.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaUser />
            <span>Tên nhân viên</span>
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaUserTag />
            <span>Giới tính</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaPhone />
            <span>Số điện thoại</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt />
            <span>Ngày sinh</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt />
            <span>Ngày vào làm</span>
          </label>
          <input
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaEnvelope />
            <span>Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaMapMarkerAlt />
            <span>Địa chỉ</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaUserTag /> Chức vụ
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="Nhân viên">Nhân viên</option>
            {/* Hiển thị "Quản lý" nếu không phải là Quản lý */}
            {employee?.position == "Quản lý" && (
              <option value="Quản lý">Quản lý</option>
            )}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaDollarSign />
            <span>Lương cơ bản</span>
          </label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FaToggleOn />
            <span>Trạng thái</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isUpdate ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        </button>
      </div>
    </form>
  );
};

export default UpdateEmployeeForm;
