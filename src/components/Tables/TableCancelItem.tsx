"use client";
import React, { useEffect, useState } from "react";
import { Receipt } from "@/types/receipt";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho Next.js 13
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useEmployeeStore } from "@/stores/employeeStore";
import SearchInput from "../Search/SearchInputProps";
import { handlePrintPDF } from "../PDF/cancelItem_PDF";

const TableCancelItem = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedCancel, setSelectedCancel] = useState<Receipt | null>(null);
  const [CancelDetails, setCancelDetails] = useState<any[]>([]);
  const router = useRouter(); // Khai báo useRouter
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCancel, setPaginatedCancel] = useState<Receipt[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!employee || !employee.warehouseId) return;
      try {
        const response = await axiosInstance.get(
          API_ROUTES.CANCEL_DELIVERY_NOTE_WAREHOUSE(employee?.warehouseId),
        );

        // Map dữ liệu trả về thành danh sách phiếu
        const cancelList = await Promise.all(
          response.data.map(async (item: any) => {
            return {
              id: item.id,
              date: new Date(item.deliveryDate),
              price: item.price,
              status: item.status === 1 ? "Đã hủy kho" : "Đã hủy phiếu",
              employee: item.employeeId,
            };
          }),
        );

        // Lọc phiếu hủy theo mã phiếu (PHH000...)
        const filteredCancel = cancelList.filter(
          (cancel) =>
            cancel.id.toString().includes(searchTerm) ||
            format(cancel.date, "dd/MM/yyyy - HH:mm:ss").includes(
              searchTerm,
            ) ||
            cancel.supplier.toLowerCase().includes(searchTerm) || // Tìm kiếm theo tên nhà cung cấp (nếu có)
            cancel.employee.toString().includes(searchTerm),
        );

        // Sắp xếp phiếu theo ngày
        const sortedReceipts = filteredCancel.sort((a, b) => b.date - a.date);

        setReceipts(sortedReceipts);

        // Tính toán số trang
        const total = Math.ceil(filteredCancel.length / pageSize);
        setTotalPages(total);

        // Phân trang
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedData = filteredCancel.slice(
          startIndex,
          startIndex + pageSize,
        );
        setPaginatedCancel(paginatedData);
      } catch (error) {
        console.error("Error fetching receipts: ", error);
      }
    };

    fetchReceipts();
  }, [employee, currentPage, pageSize, searchTerm]); // Thêm searchQuery vào dependencies

  const handleCancelClick = async (receipt: Receipt) => {
    try {
      if (selectedCancel && selectedCancel.id === receipt.id) {
        setSelectedCancel(null); // Nếu sản phẩm đã được chọn, click lại để ẩn thông tin chi tiết
        setCancelDetails([]);
      } else {
        const inventoryResponse = await axiosInstance.get(
          API_ROUTES.DELIVERY_NOTE_DETAILS(receipt.id),
        );
        setCancelDetails(inventoryResponse.data);
        setSelectedCancel(receipt);
      }
    } catch (error) {
      console.error("Error fetching receipt details: ", error);
    }
  };

  const handleOpenReceipt = (receipt: Receipt) => {
    // Chuyển hướng đến trang cập nhật và truyền dữ liệu
    router.push(`/receipts/update?id=${receipt.id}`);
  };
  const handleCancel = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn hủy phiếu này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, hủy phiếu!",
        cancelButtonText: "Không",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(
          `http://localhost:8888/v1/api/deliveryNotes/${id}`,
        );

        Swal.fire({
          title: "Đã hủy!",
          text: "Phiếu đã được hủy thành công!",
          icon: "success",
        });

        // Cập nhật lại danh sách phiếu sau khi hủy
        setReceipts(receipts.filter((receipt) => receipt.id !== id));
        setSelectedCancel(null);
        setCancelDetails([]);
      }
    } catch (error) {
      console.error("Error cancelling receipt: ", error);

      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi hủy phiếu!",
        icon: "error",
      });
    }
  };

  const totalQuantity = CancelDetails.reduce(
    (acc, detail) => acc + detail.quantity,
    0,
  );
  const totalItems = CancelDetails.length;
  const totalPrice = CancelDetails.reduce(
    (acc, detail) => acc + detail.purchasePrice * detail.quantity,
    0,
  );
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              HỦY HÀNG
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
            <Link href="/remove-Items/add">
              <button className="rounded bg-green-600 px-4 py-2 text-white">
                Tạo phiếu hủy
              </button>
            </Link>
            <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white ">
          <div className="col-span-4  ml-6">Mã hủy hàng</div>
          <div className="col-span-4 ">Thời gian</div>
          {/* <div className="col-span-2 ">Trả nhà cung cấp</div> */}
          {/* <div className="col-span-3 ">Giá xuất</div> */}
          <div className="col-span-4 ">Trạng thái</div>
        </div>
      </div>

      {paginatedCancel.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleCancelClick(receipt)}
              >
                <CheckboxTwo />
                <p className="mr-3 text-sm font-bold text-black text-blue-800 dark:text-white">
                  PHH000{receipt.id}
                </p>
              </div>
              <div className="col-span-4">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {format(receipt.date, "dd/MM/yyyy - HH:mm:ss")}
                </p>
              </div>
              {/* <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{receipt.supplier}</p>
              </div> */}
              {/* <div className="col-span-3">
                <p className="text-sm text-black dark:text-white mt-2"> {receipt.price ? formatCurrency(receipt.price) : formatCurrency(0)}</p>
              </div> */}
              <div className="col-span-4">
                <p className="text-sm text-meta-3">{receipt.status}</p>
              </div>
            </div>
          </div>

          {selectedCancel && selectedCancel.id === receipt.id && (
            <div className="text-xm border border-blue-700 px-4 py-4.5 text-black dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block p-2 text-2xl font-bold text-blue-500 dark:text-white">
                      Thông tin
                    </label>
                    <ul className="list-none p-2 ">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Mã phiếu hủy:{" "}
                        <span className="font-bold text-blue-700">
                          PHH000{selectedCancel.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Thời gian:
                        <span className="font-bold">
                          {format(receipt.date, "dd/MM/yyyy - HH:mm:ss")}{" "}
                        </span>
                      </li>{" "}
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Cân bằng kho:{" "}
                        <span className="font-bold text-blue-500">
                          Đã cân bằng kho
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-14 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Trạng thái:{" "}
                        <span className="font-bold text-blue-500">
                          {receipt.status}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Người hủy hàng:{" "}
                        <span className="font-bold">
                          NV000{receipt.employee}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 pt-12">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Ghi chú
                      </label>
                      <textarea
                        rows={3}
                        placeholder=""
                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="container mx-auto border border-blue-600 bg-blue-50">
                  <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-600 py-4.5 font-bold text-white">
                    <div className="col-span-4 ml-6 ">Mã mặt hàng</div>
                    <div className="col-span-2 ">Tên hàng</div>
                    <div className="col-span-2 ">Số lượng</div>
                    <div className="col-span-2 ">Đơn giá</div>
                    <div className="col-span-2 ">Thành tiền</div>
                  </div>

                  {CancelDetails.map((detail) => (
                    <div
                      className="grid grid-cols-12 gap-4 border-b border-stroke py-2"
                      key={detail.productId}
                    >
                      <div className="col-span-4 px-6 text-blue-500">
                        MH000{detail.productId}
                      </div>
                      <div className="col-span-2">{detail.nameProduct}</div>
                      <div className="col-span-2">{detail.quantity}</div>
                      <div className="col-span-2">{detail.purchasePrice}</div>
                      {/* <div className="col-span-2">{detail.purchasePrice * detail.quantity}</div> */}
                    </div>
                  ))}

                  <div className="mt-3 grid grid-cols-12 py-2">
                    <div className="col-span-9"></div>
                    <div className="col-span-3">
                      <ul className="list-none p-0">
                        <li className="border-gray-300 mb-2 border-b pb-2">
                          Tổng số lượng:{" "}
                          <span className="ml-3 font-bold">
                            {totalQuantity}
                          </span>
                        </li>
                        <li className="border-gray-300 mb-2 border-b pb-2">
                          Tổng mặt hàng:{" "}
                          <span className="ml-3 font-bold">{totalItems}</span>
                        </li>
                        {/* <li className="mb-2 border-b border-gray-300 pb-2">Tổng tiền thiệt hại: <span className="font-bold text-blue-500 ml-3">{formatCurrency(totalPrice)}</span></li> */}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-12 py-6">
                  <div className="col-span-7"></div>
                  <div className="col-span-5 flex justify-end px-2 font-bold">
                    <button
                      onClick={() => handleOpenReceipt(receipt)}
                      className="mr-2 rounded bg-green-600 px-4 py-2 text-white"
                    >
                      Mở phiếu
                    </button>
                    <button
                      className="rounded bg-red px-4 py-2 text-white"
                      onClick={() => handleCancel(receipt.id)}
                    >
                      Hủy
                    </button>
                    <button
                      className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
                      onClick={() => handlePrintPDF(receipt, CancelDetails)} // Gọi hàm in PDF
                    >
                      In PDF
                    </button>
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

export default TableCancelItem;
