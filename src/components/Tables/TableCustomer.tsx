"use client";
import React, { useEffect, useState } from 'react';
import { Customer } from '@/types/customer'; // Cập nhật kiểu dữ liệu cho khách hàng
import Modal from '@/components/Modal/Modal';
import FormAddCustomer from '@/components/FormElements/customer/AddCustomerForm';
import Update from '@/components/FormElements/customer/UpdateCustomerForm'; // Đảm bảo có component Update
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance'
import { useEmployeeStore } from "@/stores/employeeStore";
import SearchInput from '../Search/SearchInputProps';

const TableCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCustomers, setPaginatedCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.CUSTOMERS);
        const allCustomers = response.data;
  
        // Lọc danh sách khách hàng theo searchTerm
        const filteredCustomers = allCustomers.filter((customer: Customer) =>
          customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        setCustomers(filteredCustomers);
  
        // Tính toán tổng số trang
        const total = Math.ceil(filteredCustomers.length / pageSize);
        setTotalPages(total);
  
        // Phân trang
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedData = filteredCustomers.slice(startIndex, startIndex + pageSize);
        setPaginatedCustomers(paginatedData);
  
      } catch (error) {
        console.error("Error fetching customers: ", error);
      }
    };
  
    fetchCustomers();
  }, [currentPage, pageSize, searchTerm]);  // Thêm searchTerm vào dependency array
  

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
  };

  const handleSuccess = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.CUSTOMERS);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching updated customers: ", error);
    }
  };

  const handleUpdateClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowUpdateForm(true);
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
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddCustomerForm(true)}
            >
              Thêm mới
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div>
      </div>

      {/* Modal Thêm khách hàng */}
      <Modal isVisible={showAddCustomerForm} onClose={handleCloseModal} title="THÊM KHÁCH HÀNG">
        <FormAddCustomer onClose={handleCloseModal} setCustomers={setCustomers} onSuccess={handleSuccess} />
      </Modal>

      {/* Modal Cập nhật khách hàng */}
      <Modal isVisible={showUpdateForm} onClose={handleCloseModal} title="CẬP NHẬT THÔNG TIN">
        {selectedCustomer && (
          <Update
            onClose={handleCloseModal}
            setCustomers={setCustomers}
            onSuccess={handleSuccess}
            customer={selectedCustomer}
          />
        )}
      </Modal>

      <div className="container mx-auto ">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold">
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
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white font-bold text-blue-700 ml-2">KH000{customer.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{customer.customerName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{customer.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{customer.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">{customer.dateOfBirth}</p>
              </div>
              <div className="col-span-2 ">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleCustomerClick(customer)}
                >
                  Xem
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => handleUpdateClick(customer)}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          {selectedCustomer && selectedCustomer.id === customer.id && (
            <div className="px-4 py-4.5 border  border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 text-black bg-blue-50 ">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="mb-3 block font-bold  text-blue-700 dark:text-white text-2xl ">
                     {customer.customerName} 
                    </label>
                    <ul className="list-none py-2">
                      <li className="mb-2 border-b border-gray-300 pb-2">ID: <span className="font-bold ml-2 text-blue-700">KH000{customer.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Số điện thoại: <span className="font-bold ml-2">{customer.phoneNumber}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Ngày sinh: <span className="font-bold ml-2">{customer.dateOfBirth}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-6 mt-12">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Địa chỉ: <span className="font-bold ml-2">{customer.detailedAddress}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Email: <span className="font-bold ml-2">{customer.email}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Ghi chú: <span className="font-bold ml-2">{customer.note}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-12 py-2 bg-green-600">
                  <div className="col-span-6">
                 <button className="bg-green-600 text-white px-4 py-2 rounded mr-2 font-bold"></button>
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
