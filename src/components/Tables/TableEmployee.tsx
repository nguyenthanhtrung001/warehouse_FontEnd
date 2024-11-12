"use client";
// src/components/TableEmployee.tsx
import React, { useEffect, useState } from 'react';
import { Employee } from '@/types/employee';
import Modal from '@/components/Modal/Modal';
import FormAddEmployee from '@/components/FormElements/employee/AddEmployeeForm';
import FormUpdateEmployee from '@/components/FormElements/employee/UpdateEmployeeForm';
import { useRouter } from "next/navigation";
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance';
import { useEmployeeStore } from '@/stores/employeeStore';

const TableEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // Thêm trạng thái cập nhật
  const [error, setError] = useState<string | null>(null);
  const { employee } = useEmployeeStore();
 

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!employee) {
        console.error("Employee data is not available.");
        return; // Nếu employee không tồn tại, không gọi API
      }
      try {
        if (!employee || !employee.warehouseId) return;
        console.log("Fetching data for employee: ", employee);
        const response = await axiosInstance.get(
          API_ROUTES.EMPLOYEES_BY_WAREHOUSE_AND_NOT_EMPLOYEE (employee.warehouseId ,employee.id )
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees: ", error);
        setError("Có lỗi xảy ra khi lấy dữ liệu nhân viên.");
      }
    };
  
    fetchEmployees();
  }, [employee]); // Gọi lại API khi employee thay đổi
  const handleEmployeeClick = (employee: Employee) => {
    if (selectedEmployee && selectedEmployee.id === employee.id) {
      setSelectedEmployee(null); // Nếu nhân viên đã được chọn, click lại để ẩn thông tin chi tiết
    } else {
      setSelectedEmployee(employee);
    }
  };

  const handleCloseModal = () => {
    setShowAddEmployeeForm(false);
    setIsUpdate(false); // Reset trạng thái cập nhật khi đóng modal
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleUpdateClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAddEmployeeForm(true);
    setIsUpdate(true); // Chuyển sang trạng thái cập nhật
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              NHÂN VIÊN
            </h4>
          </div>
          <div className="col-span-3 px-2 font-bold">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => { 
                setShowAddEmployeeForm(true);
                setIsUpdate(false); // Đảm bảo trạng thái không phải là cập nhật khi thêm mới
              }}
            >
              Thêm mới
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div> 
      </div>

      {/* Modal */}
      <Modal 
        isVisible={showAddEmployeeForm} 
        onClose={handleCloseModal} 
        title={isUpdate ? "CẬP NHẬT THÔNG TIN" : "THÊM NHÂN VIÊN"}
      >
        {isUpdate ? (
          <FormUpdateEmployee employee={selectedEmployee} isUpdate={isUpdate} />
        ) : (
          <FormAddEmployee employee ={selectedEmployee} isUpdate={isUpdate} />
        )}
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 font-bole text-white font-bold ">
          <div className="col-span-2 ">ID</div>
          <div className="col-span-2 ">Tên nhân viên</div>
          <div className="col-span-2 ">Chức vụ</div>
          <div className="col-span-2 ">Số điện thoại</div>
          <div className="col-span-2 ">Email</div>
          <div className="col-span-2 ">Hành động</div>
        </div>
      </div>

      {employees.map((employee) => (
        <React.Fragment key={employee.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
              <p className="text-sm text-black dark:text-white font-bold text-blue-500 ml-2">NV000{employee.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{employee.employeeName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{employee.position}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{employee.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{employee.email}</p>
              </div>
              <div className="col-span-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  Xem
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => handleUpdateClick(employee)}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          {selectedEmployee && selectedEmployee.id === employee.id && (
            <div className="px-4 py-4.5 border  border-blue-700 bg-blue-50 dark:border-strokedark md:px-6 2xl:px-7.5 text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <label className="mb-3 block p-2 font-bold text-blue-700 dark:text-white text-2xl">
                      Nhân viên: {employee.employeeName}
                    </label>
                    <ul className="list-none p-0">
                    <li className="mb-2 border-b border-gray-300 pb-2 ">ID: <span className="font-bold text-blue-700 ml-2">NV000{employee.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Chức vụ: <span className="font-bold ml-2">{employee.position}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Lương cơ bản: <span className="font-bold ml-2">{formatCurrency(employee.basicSalary)}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Giới tính: <span className="font-bold ml-2">{employee.gender}</span></li>
                      </ul>
                  </div>
                  <div className="col-span-5 p-2 mt-13">
                    <ul className="list-none p-0">
                     <li className="mb-2 border-b border-gray-300 pb-2">Ngày sinh: <span className="font-bold ml-2">{employee.dateOfBirth}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Ngày vào: <span className="font-bold ml-2">{employee.dateJoined}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Địa chỉ: <span className="font-bold ml-2">{employee.address}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Email: <span className="font-bold ml-2">{employee.email}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-2 py-8">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Trạng thái
                      </label>
                      <textarea
                        rows={1}
                        className=" text-center w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-green-700 font-bold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        disabled
                      >{employee.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}</textarea>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 mt-3 ">
                  <div className="col-span-6"></div>
                  <div className="col-span-6 flex justify-end">
                    
                    {employee.account_id ? (
                      <button className="bg-red text-white px-4 py-2 rounded ">
                        Khóa tài khoản
                      </button>
                    ) : (
                      <button className="bg-green-600 text-white px-4 py-2 rounded ">
                        Tạo tài khoản
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TableEmployee;
