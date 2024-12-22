"use client";
import React, { useEffect, useState } from "react";
import { Customer } from "@/types/customer"; // Cập nhật kiểu dữ liệu cho khách hàng
import Modal from "@/components/Modal/Modal";
import FormAddCustomer from "@/components/FormElements/customer/AddCustomerForm";
import Update from "@/components/FormElements/customer/UpdateCustomerForm"; // Đảm bảo có component Update
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import { useEmployeeStore } from "@/stores/employeeStore";
import SearchInput from "../Search/SearchInputProps";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";

const TableCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCustomers, setPaginatedCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.CUSTOMERS);
      const allCustomers = response.data;

      // Lọc danh sách khách hàng theo searchTerm
      const filteredCustomers = allCustomers.filter(
        (customer: Customer) =>
          customer.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const sortedCustomers = filteredCustomers.sort(
        (a: { id: number }, b: { id: number }) => b.id - a.id, // Sắp xếp giảm dần theo id
      );

      setCustomers(sortedCustomers);

      // Tính toán tổng số trang
      const total = Math.ceil(filteredCustomers.length / pageSize);
      setTotalPages(total);

      // Phân trang
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = filteredCustomers.slice(
        startIndex,
        startIndex + pageSize,
      );
      setPaginatedCustomers(paginatedData);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize, searchTerm]); // Thêm searchTerm vào dependency array

  const handleCustomerClick = (customer: Customer) => {
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer(null); // Nếu khách hàng đã được chọn, click lại để ẩn thông tin chi tiết
    } else {
      setSelectedCustomer(customer);
    }
  };

  const handleCloseModal = () => {
    setShowAddCustomerForm(false);
    setShowUpdateForm(false);
    fetchCustomers();
  };



  const handleUpdateClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowUpdateForm(true);
  };
  const handleDeleteCustomer = async (customerId: number) => {
    // Xác nhận trước khi xóa
    const isConfirmed = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa khách hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    });

    if (!isConfirmed.isConfirmed) return;

    try {
      // Gọi API xóa khách hàng
      await axiosInstance.delete(`${API_ROUTES.CUSTOMERS}/${customerId}`);

      // Thông báo thành công
      await Swal.fire({
        title: "Thành công!",
        text: "Khách hàng đã được xóa thành công!",
        icon: "success",
      });

      // Cập nhật lại danh sách khách hàng sau khi xóa
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer: ", error);

      // Thông báo thất bại khi xóa
      await Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi xóa khách hàng.",
        icon: "error",
      });
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              KHÁCH HÀNG
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
          <div className="col-span-3 flex justify-end  font-bold">
            <button
              className="rounded bg-green-600 px-4 py-2 text-white"
              onClick={() => setShowAddCustomerForm(true)}
            >
              Thêm mới
            </button>
            {/* <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button> */}
          </div>
        </div>
      </div>

      {/* Modal Thêm khách hàng */}
      <Modal
        isVisible={showAddCustomerForm}
        onClose={handleCloseModal}
        title="THÊM KHÁCH HÀNG"
      >
        <FormAddCustomer
          onClose={handleCloseModal}
          setCustomers={setCustomers}
          onSuccess={fetchCustomers}
        />
      </Modal>

      {/* Modal Cập nhật khách hàng */}
      <Modal
        isVisible={showUpdateForm}
        onClose={handleCloseModal}
        title="CẬP NHẬT THÔNG TIN"
      >
        {selectedCustomer && (
          <Update
            onClose={handleCloseModal}
            setCustomers={setCustomers}
            onSuccess={fetchCustomers}
            customer={selectedCustomer}
          />
        )}
      </Modal>

      <div className="container mx-auto ">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white">
          <div className="col-span-2 ">ID</div>
          <div className="col-span-2 ">Tên khách hàng</div>
          <div className="col-span-2 ">Số điện thoại</div>
          <div className="col-span-2 ">Email</div>
          <div className="col-span-2 ">Ngày sinh</div>
          <div className="col-span-2 ">Hành động</div>
        </div>
      </div>

      {paginatedCustomers.map((customer) => (
        <React.Fragment key={customer.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <p className="ml-2 text-sm font-bold text-black text-blue-700 dark:text-white">
                  KH000{customer.id}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {customer.customerName}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {customer.phoneNumber}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {customer.email}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {customer.dateOfBirth}
                </p>
              </div>
              <div className="col-span-2 flex space-x-2">
                {/* Nút Xem */}
                <button
                  className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                  onClick={() => handleCustomerClick(customer)}
                >
                  <AiFillEye size={20} className="text-white" />{" "}
                  {/* Icon Xem */}
                </button>

                {/* Nút Cập nhật */}
                <button
                  className="flex items-center justify-center rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                  onClick={() => handleUpdateClick(customer)}
                >
                  <AiFillEdit size={20} className="text-white" />{" "}
                  {/* Icon Cập nhật */}
                </button>

                {/* Nút Xóa */}
                <button
                  className="bg-red hover:bg-red flex items-center justify-center rounded p-2 text-white"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  <AiFillDelete size={20} className="text-white" />{" "}
                  {/* Icon Xóa */}
                </button>
              </div>
            </div>
          </div>

          {selectedCustomer && selectedCustomer.id === customer.id && (
            <div className="border border-blue-700 bg-blue-50  px-4 py-4.5 text-black dark:border-strokedark md:px-6 2xl:px-7.5 ">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="mb-3 block text-2xl  font-bold text-blue-700 dark:text-white ">
                      {customer.customerName}
                    </label>
                    <ul className="list-none py-2">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        ID:{" "}
                        <span className="ml-2 font-bold text-blue-700">
                          KH000{customer.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Số điện thoại:{" "}
                        <span className="ml-2 font-bold">
                          {customer.phoneNumber}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ngày sinh:{" "}
                        <span className="ml-2 font-bold">
                          {customer.dateOfBirth}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-6 mt-12">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Địa chỉ:{" "}
                        <span className="ml-2 font-bold">
                          {customer.detailedAddress}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Email:{" "}
                        <span className="ml-2 font-bold">{customer.email}</span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ghi chú:{" "}
                        <span className="ml-2 font-bold">{customer.note}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-12 bg-green-600 py-2">
                  <div className="col-span-6">
                    <button className="mr-2 rounded bg-green-600 px-4 py-2 font-bold text-white"></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="pagination my-4 flex items-center justify-center space-x-4">
        <button
          className={`prev-page rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        <span className="text-gray-700 text-lg">
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className={`next-page rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default TableCustomer;
