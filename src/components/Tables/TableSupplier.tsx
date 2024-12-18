"use client";
import React, { useEffect, useState } from "react";
import { Supplier } from "@/types/supplier";
import Modal from "@/components/Modal/Modal";
import FormAddSupplier from "@/components/FormElements/supplier/AddSupplierForm";
import FormUpdateSupplier from "@/components/FormElements/supplier/UpdateSupplierForm";
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import SearchInput from "../Search/SearchInputProps";
import Swal from "sweetalert2";

const TableSupplier = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [showUpdateSupplierForm, setShowUpdateSupplierForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng nhà cung cấp trên mỗi trang
  const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.SUPPLIERS);
      const allSuppliers = response.data;

      // Lọc danh sách nhà cung cấp theo searchTerm
      const filteredSuppliers = allSuppliers.filter(
        (supplier: Supplier) =>
          supplier.supplierName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.phoneNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      const sortedSuppliers = filteredSuppliers.sort(
        (a: { id: number }, b: { id: number }) => b.id - a.id, // Sắp xếp giảm dần theo id
      );

      setSuppliers(sortedSuppliers);
    } catch (error) {
      console.error("Error fetching suppliers: ", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm]); // Cập nhật khi searchTerm thay đổi

  // Tính toán chỉ số của nhà cung cấp cần hiển thị
  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = suppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier,
  );

  // Tổng số trang
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  // Chuyển sang trang tiếp theo
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSupplierClick = (supplier: Supplier) => {
    if (selectedSupplier && selectedSupplier.id === supplier.id) {
      setSelectedSupplier(null);
    } else {
      setSelectedSupplier(supplier);
    }
  };

  const handleCloseModal = () => {
    setShowAddSupplierForm(false);
    setShowUpdateSupplierForm(false);
  };

  const handleUpdateClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowUpdateSupplierForm(true);
  };
  const handleDeleteSupplier = async (id: number) => {
    const isConfirmed = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
      text: "Việc xóa sẽ không thể khôi phục lại!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (isConfirmed.isConfirmed) {
      try {
        // Gửi yêu cầu xóa nhà cung cấp
        await axiosInstance.delete(`${API_ROUTES.SUPPLIERS}/${id}`);

        // Thông báo thành công
        Swal.fire({
          title: "Thành công!",
          text: "Nhà cung cấp đã được xóa thành công.",
          icon: "success",
        });

        // Cập nhật lại danh sách sau khi xóa
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      } catch (error) {
        console.error("Error deleting supplier: ", error);
        // Thông báo lỗi
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi xóa nhà cung cấp.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              NHÀ CUNG CẤP
            </h4>
          </div>
          <div className="col-span-6 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>

          <div className="col-span-3 flex justify-end px-2 font-bold">
            <button
              className="rounded bg-green-600 px-4 py-2 text-white"
              onClick={() => setShowAddSupplierForm(true)}
            >
              Thêm mới
            </button>
            {/* <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button> */}
          </div>
        </div>
      </div>

      {/* Modal thêm nhà cung cấp */}
      <Modal
        isVisible={showAddSupplierForm}
        onClose={handleCloseModal}
        title="THÊM NHÀ CUNG CẤP"
      >
        <FormAddSupplier />
      </Modal>

      {/* Modal cập nhật nhà cung cấp */}
      <Modal
        isVisible={showUpdateSupplierForm}
        onClose={handleCloseModal}
        title="CẬP NHẬT THÔNG TIN"
      >
        <FormUpdateSupplier supplier={selectedSupplier} />
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white">
          <div className="col-span-3 ">ID</div>
          <div className="col-span-3 ">Tên nhà cung cấp</div>
          <div className="col-span-3 ">Số điện thoại</div>
          <div className="col-span-3 ">Hành động</div>
        </div>
      </div>

      {currentSuppliers.map((supplier) => (
        <React.Fragment key={supplier.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b px-4 py-2">
            <div className="mt-1 grid grid-cols-12 gap-4 ">
              <div className="col-span-3">
                <p className="ml-2 text-sm font-bold text-black text-blue-500 dark:text-white">
                  NCC000{supplier.id}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white">
                  {supplier.supplierName}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white">
                  {supplier.phoneNumber}
                </p>
              </div>
              <div className="col-span-3">
                <button
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={() => handleSupplierClick(supplier)}
                >
                  Xem
                </button>
                <button
                  className="ml-2 rounded bg-yellow-500 px-4 py-2 text-white"
                  onClick={() => handleUpdateClick(supplier)}
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className="ml-2 rounded bg-red px-4 py-2 text-white"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

          {selectedSupplier && selectedSupplier.id === supplier.id && (
            <div className="border border-blue-700 bg-blue-50 px-4 py-4.5 text-black dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="mb-3 block p-2 text-2xl font-bold text-blue-700 dark:text-white">
                      {supplier.supplierName}
                    </label>
                    <ul className="list-none p-2">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        ID:{" "}
                        <span className="ml-2 font-bold">
                          NCC000{supplier.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Số điện thoại:{" "}
                        <span className="ml-2 font-bold">
                          {supplier.phoneNumber}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-6 mt-15 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Địa chỉ:{" "}
                        <span className="ml-2 font-bold">
                          {supplier.address}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Email:{" "}
                        <span className="ml-2 font-bold">{supplier.email}</span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ghi chú:{" "}
                        <span className="ml-2 font-bold">{supplier.note}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Pagination controls */}
      <div className="flex justify-center py-4">
        <button
          className="border-gray-300 mr-2 rounded-lg border px-4 py-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        {/* Hiển thị số trang */}
        <span className="px-4 py-2 text-lg">
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className="border-gray-300 ml-2 rounded-lg border px-4 py-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default TableSupplier;
