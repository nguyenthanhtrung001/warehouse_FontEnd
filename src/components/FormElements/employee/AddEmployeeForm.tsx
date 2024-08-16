import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import Swal from 'sweetalert2';
import { Employee } from '@/types/employee';
import Switcher from '@/components/Switchers/SwitcherThree'

interface FormAddEmployeeProps {
  employee?: Employee | null;
  isUpdate: boolean;
}

const FormAddEmployee: React.FC<FormAddEmployeeProps> = ({ employee, isUpdate }) => {
  
  // Hàm để lấy ngày hiện tại dưới dạng chuỗi yyyy-mm-dd
  const getCurrentDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    id: '',
    employeeName: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: '',
    dateJoined: getCurrentDateString(),
    email: '',
    address: '',
    position: 'Nhân viên', 
    status: 1,
    basicSalary: 0,
    account_id: false, 
    
    
  });

  useEffect(() => {
    if (employee && isUpdate) {
      setFormData({
        ...employee,
        id: employee.id.toString(),
        dateOfBirth: new Date(employee.dateOfBirth).toISOString().split('T')[0],
        dateJoined: new Date(employee.dateJoined).toISOString().split('T')[0],
        account_id: false,
        position: employee.position || 'Nhân viên',
      });
    } else {
      setFormData({
        id: '',
        employeeName: '',
        gender: '',
        phoneNumber: '',
        dateOfBirth: '',
        dateJoined: getCurrentDateString(),
        email: '',
        address: '',
        position: 'Nhân viên',
        status: 1,
        basicSalary: 0,
        account_id: false,
      });
    }
  }, [employee, isUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, account_id: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmResult = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn không thể hoàn tác thay đổi này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xác nhận!',
      cancelButtonText: 'Hủy',
    });

    if (confirmResult.isConfirmed) {
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
          text: 'Dữ liệu đã được cập nhật.',
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error submitting form: ", error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi gửi dữ liệu.',
          icon: 'error',
        });
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="focus:border-indigo-500 focus:outline-none mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div >
        Tạo tài khoản hệ thống
          <Switcher
            isChecked={formData.account_id}
            onChange={handleCheckboxChange}
          /> 
        </div>
        
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          type="submit" 
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isUpdate ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default FormAddEmployee;
