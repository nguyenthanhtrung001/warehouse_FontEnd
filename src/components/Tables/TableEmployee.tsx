"use client";
// src/components/TableEmployee.tsx
import React, { useEffect, useState } from "react";
import { Employee } from "@/types/employee";
import Modal from "@/components/Modal/Modal";
import FormAddEmployee from "@/components/FormElements/employee/AddEmployeeForm";
import FormUpdateEmployee from "@/components/FormElements/employee/UpdateEmployeeForm";
import API_ROUTES from "@/utils/apiRoutes";
import axiosInstance from "@/utils/axiosInstance";
import { useEmployeeStore } from "@/stores/employeeStore";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";

const TableEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { employee } = useEmployeeStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const fetchEmployees = async () => {
    if (!employee) {
      console.error("Employee data is not available.");
      return;
    }
    if (employee.position.toLowerCase().includes("admin")) {
      employee.warehouseId = 0;
    }
    try {
      console.log("nha vien kho: ", employee.warehouseId);
      const response = await axiosInstance.get(
        API_ROUTES.EMPLOYEES_BY_WAREHOUSE_AND_NOT_EMPLOYEE(
          employee.warehouseId,
          employee.id,
        ),
      );
      let filteredEmployees = response.data;

      // Apply flexible filters based on employee position
      const position = employee.position.toLowerCase();
      console.log("nhan vien:", position);
      if (position.includes("quản lý")) {
        // Only include "nhân viên" positions
        filteredEmployees = filteredEmployees.filter(
          (emp: { position: string }) =>
            emp.position.toLowerCase().includes("nhân viên"),
        );
      } else if (position.includes("admin")) {
        // Exclude "admin" and "nhân viên" positions
        filteredEmployees = filteredEmployees.filter(
          (emp: { position: string }) =>
            emp.position.toLowerCase().includes("quản lý"),
        );
      }

      const sortedCustomers = filteredEmployees.sort(
        (a: { id: number }, b: { id: number }) => b.id - a.id, // Sắp xếp giảm dần theo id
      );
      setEmployees(sortedCustomers);
      console.log("nhan vien:", JSON.stringify(sortedCustomers, null, 2));
    } catch (error) {
      console.error("Error fetching employees: ", error);
      setError("Có lỗi xảy ra khi lấy dữ liệu nhân viên.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [employee]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee((prev) =>
      prev && prev.id === employee.id ? null : employee,
    );
  };

  const handleCloseModal = () => {
    setShowAddEmployeeForm(false);
    setIsUpdate(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleUpdateClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAddEmployeeForm(true);
    setIsUpdate(true);
  };

  // Calculate employees for current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );

  // Pagination controls
  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Hàm tạo tài khoản

  const createAccount = async (employeeId: number) => {
    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn tạo tài khoản cho nhân viên này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, tiếp tục gọi API tạo tài khoản
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post(
          "http://localhost:8888/v1/api/employees/create-account",
          null,
          {
            params: {
              employeeId: employeeId,
            },
          },
        );

        console.log("Account created:", response.data);

        // Hiển thị thông báo thành công bằng SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Tài khoản đã được tạo thành công!",
          confirmButtonText: "OK",
        });

        // Tải lại dữ liệu sau khi tạo tài khoản
        fetchEmployees();
      } catch (error) {
        console.error("Error creating account:", error);

        // Hiển thị thông báo lỗi bằng SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tạo tài khoản.",
          confirmButtonText: "Thử lại",
        });
      }
    }
  };
  const deleteEmployee = async (employeeId: number) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa nhân viên này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `http://localhost:8888/v1/api/employees/${employeeId}noooooooooooooooooooo`,
        );
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Nhân viên đã được xóa.",
          confirmButtonText: "OK",
        });

        // Tải lại danh sách nhân viên sau khi xóa
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xóa nhân viên.",
          confirmButtonText: "Thử lại",
        });
      }
    }
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
              className="flex justify-end rounded bg-green-600 px-4  py-2 text-white"
              onClick={() => {
                setShowAddEmployeeForm(true);
                setIsUpdate(false);
              }}
            >
              Thêm mới
            </button>
            {/* <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button> */}
          </div>
        </div>
      </div>

      <Modal
        isVisible={showAddEmployeeForm}
        onClose={handleCloseModal}
        title={isUpdate ? "CẬP NHẬT THÔNG TIN" : "THÊM NHÂN VIÊN"}
      >
        {isUpdate ? (
          <FormUpdateEmployee employee={selectedEmployee} isUpdate={isUpdate} />
        ) : (
          <FormAddEmployee />
        )}
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white">
          <div className="col-span-2">ID</div>
          <div className="col-span-2">Tên nhân viên</div>
          <div className="col-span-2">Chức vụ</div>
          <div className="col-span-2">Số điện thoại</div>
          <div className="col-span-2">Mã Kho</div>
          <div className="col-span-2">Hành động </div>
        </div>
      </div>

      {currentEmployees.map((employee) => (
        <React.Fragment key={employee.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <p className="ml-2 text-sm font-bold text-black text-blue-500 dark:text-white">
                  NV000{employee.id}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {employee.employeeName}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {employee.position}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {employee.phoneNumber}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  K000{employee.warehouseId}
                </p>
              </div>
              <div className="col-span-2 flex space-x-2">
                {/* Nút Xem */}
                <button
                  className="flex items-center justify-center rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <AiFillEye className="text-white" size={20} />{" "}
                  {/* Icon Xem */}
                </button>

                {/* Nút Cập nhật */}
                <button
                  className="flex items-center justify-center rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                  onClick={() => handleUpdateClick(employee)}
                >
                  <AiFillEdit className="text-white" size={20} />{" "}
                  {/* Icon Cập nhật */}
                </button>

                {/* Nút Xóa */}
                <button
                  className="bg-red hover:bg-red flex items-center justify-center rounded px-3 py-2 text-white"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  <AiFillDelete className="text-white" size={20} />{" "}
                  {/* Icon Xóa */}
                </button>
              </div>
            </div>
          </div>

          {selectedEmployee && selectedEmployee.id === employee.id && (
            <div className="border border-blue-700 bg-blue-50 px-4 py-4.5 text-black dark:border-strokedark md:px-6 2xl:px-7.5">
              {/* Additional employee details */}
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <label className="mb-3 block p-2 text-2xl font-bold text-blue-700 dark:text-white">
                      Nhân viên: {employee.employeeName}
                    </label>
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2 ">
                        ID:{" "}
                        <span className="ml-2 font-bold text-blue-700">
                          NV000{employee.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Chức vụ:{" "}
                        <span className="ml-2 font-bold">
                          {employee.position}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Lương cơ bản:{" "}
                        <span className="ml-2 font-bold">
                          {formatCurrency(employee.basicSalary)}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Giới tính:{" "}
                        <span className="ml-2 font-bold">
                          {employee.gender}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-5 mt-13 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ngày sinh:{" "}
                        <span className="ml-2 font-bold">
                          {employee.dateOfBirth}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ngày vào:{" "}
                        <span className="ml-2 font-bold">
                          {employee.dateJoined}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Địa chỉ:{" "}
                        <span className="ml-2 font-bold">
                          {employee.address}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Email:{" "}
                        <span className="ml-2 font-bold">{employee.email}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-2 py-8">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Trạng thái
                      </label>
                      <textarea
                        rows={1}
                        className=" w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-center font-bold text-green-700 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        disabled
                      >
                        {employee.status === 1
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </textarea>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-12 ">
                  <div className="col-span-6"></div>
                  <div className="col-span-6 flex justify-end">
                    {employee.accountId ? (
                      ""
                    ) : (
                      <button
                        className="rounded bg-green-600 px-4 py-2 text-white"
                        onClick={() => createAccount(employee.id)}
                      >
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

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-200 mx-1 rounded px-3 py-1"
        >
          Trước
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 rounded px-3 py-1 ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-200 mx-1 rounded px-3 py-1"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default TableEmployee;
