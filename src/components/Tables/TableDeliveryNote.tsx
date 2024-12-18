"use client";
import React, { useEffect, useState } from "react";
import { Receipt } from "@/types/receipt";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho Next.js 13
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useEmployeeStore } from "@/stores/employeeStore";
import SearchInput from "../Search/SearchInputProps";
import { handlePrintPDF } from "../PDF/return_receipt_PDF";

const TableDeliveryNote = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptDetails, setReceiptDetails] = useState<any[]>([]);
  const router = useRouter(); // Khai báo useRouter
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [itemsPerPage] = useState(10); // Số items mỗi trang
  const [allReceipts, setAllReceipts] = useState<Receipt[]>([]); // Toàn bộ dữ liệu
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho từ khóa tìm kiếm

  const fetchNote = async () => {
    try {
      if (!employee || !employee.warehouseId) return;

      const response = await axiosInstance.get(
        API_ROUTES.DELIVERY_NOTES_WAREHOUSE(employee?.warehouseId),
      );

      const receiptList = await Promise.all(
        response.data.map(async (item: any) => {
          return {
            id: item.id,
            date: new Date(item.deliveryDate),
            supplier: item.receipt.supplier?.supplierName,
            price: item.price,
            status: item.status === 1 ? "Đã trả" : "Đã hủy",
            employee: item.employeeId,
          };
        }),
      );
      receiptList.sort((a, b) => b.date.getTime() - a.date.getTime());
      // Lọc các phiếu dựa trên từ khóa tìm kiếm
      const filteredReceipts = receiptList.filter((receipt) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          receipt.id.toString().includes(searchTermLower) || // Tìm theo mã phiếu
          receipt.supplier.toLowerCase().includes(searchTermLower) || // Tìm theo nhà cung cấp
          receipt.status.toLowerCase().includes(searchTermLower) // Tìm theo trạng thái
        );
      });

      setAllReceipts(filteredReceipts); // Lưu dữ liệu đã lọc
      setTotalPages(Math.ceil(filteredReceipts.length / itemsPerPage)); // Cập nhật số trang
      setReceipts(filteredReceipts.slice(0, itemsPerPage)); // Hiển thị trang đầu tiên của dữ liệu đã lọc
    } catch (error) {
      console.error("Error fetching receipts: ", error);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [employee, searchTerm]); // Thêm searchTerm vào mảng dependencies

  // Hàm phân trang: Hiển thị các items của trang hiện tại
  const paginate = (page: number) => {
    if (page < 1 || page > totalPages) return; // Kiểm tra nếu trang không hợp lệ
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    setReceipts(allReceipts.slice(startIndex, endIndex));
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  const handleReceiptClick = async (receipt: Receipt) => {
    try {
      if (selectedReceipt && selectedReceipt.id === receipt.id) {
        setSelectedReceipt(null); // Nếu sản phẩm đã được chọn, click lại để ẩn thông tin chi tiết
        setReceiptDetails([]);
      } else {
        const inventoryResponse = await axiosInstance.get(
          API_ROUTES.DELIVERY_NOTE_DETAILS(receipt.id),
        );
        setReceiptDetails(inventoryResponse.data);
        setSelectedReceipt(receipt);
      }
    } catch (error) {
      console.error("Error fetching receipt details: ", error);
    }
  };

  const handleCancel = async (receiptId: number) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận hủy trả hàng nhập",
        text: "Bạn chắc chắn muốn hủy?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hủy",
        cancelButtonText: "Quay lại",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`${API_ROUTES.DELIVERY_NOTES}/${receiptId}`);
        fetchNote();
        Swal.fire("Hủy thành công!", "Trả hàng đã được hủy.", "success");
      }
    } catch (error) {
      console.error("Error canceling invoice: ", error);
      Swal.fire("Hủy thất bại!", "Đã xảy ra lỗi khi hủy đơn hàng.", "error");
    }
  };

  const totalQuantity = receiptDetails.reduce(
    (acc, detail) => acc + detail.quantity,
    0,
  );
  const totalItems = receiptDetails.length;
  const totalPrice = receiptDetails.reduce(
    (acc, detail) => acc + detail.deliveryNote.price * detail.quantity,
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
          <div className="col-span-5">
            <h4 className="text-2xl text-3xl font-semibold text-black dark:text-white">
              TRẢ HÀNG NHẬP - XUẤT KHO
            </h4>
          </div>
          <div className="col-span-4 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
          <div className="col-span-3 flex justify-end  font-bold ">
            <Link href="/deliverynotes/add">
              <button className="rounded bg-green-600 px-4 py-2 text-white">
                Trả hàng nhập
              </button>
            </Link>
            {/* <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button> */}
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-1 ">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white ">
          <div className="col-span-4  ml-6">Mã xuất hàng</div>
          <div className="col-span-2 ">Thời gian</div>
          <div className="col-span-2 ">Trả nhà cung cấp</div>
          <div className="col-span-2 ">Giá xuất</div>
          <div className="col-span-2 ">Trạng thái</div>
        </div>
      </div>

      {receipts.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleReceiptClick(receipt)}
              >
                <CheckboxTwo />
                <p className="mr-3 text-sm font-bold text-black text-blue-800 dark:text-white">
                  PXT000{receipt.id}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {format(receipt.date, "dd/MM/yyyy - HH:mm:ss")}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {receipt.supplier}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {formatCurrency(receipt.price ?? 0)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{receipt.status}</p>
              </div>
            </div>
          </div>

          {selectedReceipt && selectedReceipt.id === receipt.id && (
            <div className="text-xm border border-blue-700 px-4 py-4.5 text-black dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4 ">
                    <label className="mb-2 block py-2 text-2xl font-bold text-blue-500 dark:text-white">
                      Thông tin
                    </label>
                    <ul className="list-none p-2 ">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Mã xuất kho:{" "}
                        <span className="font-bold">
                          PXT000{selectedReceipt.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Thời gian:{" "}
                        <span className="font-bold">
                          {format(receipt.date, "dd/MM/yyyy - HH:mm:ss")}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Nhà cung cấp:{" "}
                        <span className="font-bold">{receipt.supplier}</span>
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
                        Người tạo phiếu:{" "}
                        <span className="font-bold">
                          NV000{receipt.employee}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-12 p-2">
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

                <div className="bg-blue-60 container mx-auto border border-blue-500">
                  <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-600 py-4.5 font-bold text-white">
                    <div className="col-span-4 ml-6 ">Mã mặt hàng</div>
                    <div className="col-span-2 ">Tên mặt hàng</div>
                    <div className="col-span-2 ">Số lượng</div>
                    <div className="col-span-2 ">Đơn giá</div>
                    <div className="col-span-2 ">Thành tiền</div>
                  </div>

                  {receiptDetails.map((detail) => (
                    <div
                      className="grid grid-cols-12 gap-4 border-b border-stroke py-2"
                      key={detail.productId}
                    >
                      <div className="col-span-4 px-6 font-bold text-blue-700">
                        MH000{detail.productId}
                      </div>
                      <div className="col-span-2">{detail.nameProduct}</div>
                      <div className="col-span-2">{detail.quantity}</div>
                      <div className="col-span-2">
                        {formatCurrency(detail.deliveryNote.price ?? 0)}
                      </div>
                      <div className="col-span-2">
                        {formatCurrency(
                          detail.deliveryNote.price * detail.quantity,
                        )}
                      </div>
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
                        <li className="border-gray-300 mb-2 border-b pb-2">
                          Tổng tiền nhận lại:{" "}
                          <span className="ml-3 font-bold text-blue-500">
                            {formatCurrency(totalPrice)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-12 py-6">
                  <div className="col-span-7"></div>
                  <div className="col-span-5 flex justify-end px-2 font-bold">
                    <button
                      onClick={() => handleCancel(selectedReceipt.id)}
                      className="mt-4 rounded bg-red px-4 py-2 text-white"
                    >
                      Hủy Trả
                    </button>
                    <button
                      className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
                      onClick={() => handlePrintPDF(receipt, receiptDetails)} // Gọi hàm in PDF
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
      {/* Phần điều hướng trang */}
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

export default TableDeliveryNote;
