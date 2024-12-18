"use client";
import React, { useEffect, useState } from "react";
import { Receipt } from "@/types/receipt";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho Next.js 13
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useEmployeeStore } from "@/stores/employeeStore";
import SearchInput from "../Search/SearchInputProps";
import { handlePrintPDF } from "../PDF/receipt_PDF";

const TableReceipt = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptDetails, setReceiptDetails] = useState<any[]>([]);
  const router = useRouter(); // Khai báo useRouter
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedReceipts, setPaginatedReceipts] = useState<Receipt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReceipts = async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get(
        API_ROUTES.RECEIPTS_WAREHOUSE(employee?.warehouseId),
      );

      const receiptList = await Promise.all(
        response.data.map(async (item: any) => {
          return {
            id: item.id,
            date: new Date(item.receiptDate),
            supplier: item.supplier?.supplierName || "Chuyển kho",
            warehouseTransfer: item.warehouseTransfer?.warehouseName || "",

            price: item.purchasePrice,
            employee: item.employeeId,
            status:
              item.status === 1
                ? "Đã nhập"
                : item.status === 2
                  ? "Tồn tại trả hàng"
                  : item.status === 3
                    ? "Đã trả toàn bộ"
                    : item.status === 0
                      ? "Đã hủy"
                      : "Không xác định",
          };
        }),
      );

      // Lọc dữ liệu theo từ khóa tìm kiếm (searchQuery)
      const filteredReceipts = receiptList.filter(
        (receipt) =>
          receipt.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          receipt.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          receipt.status.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      // Sắp xếp danh sách phiếu nhập theo thời gian (mới nhất lên đầu)
      const sortedReceipts = filteredReceipts.sort((a, b) => b.date - a.date);

      setReceipts(sortedReceipts);

      // Tính toán phân trang
      const total = Math.ceil(sortedReceipts.length / pageSize);
      setTotalPages(total);

      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = sortedReceipts.slice(
        startIndex,
        startIndex + pageSize,
      );
      setPaginatedReceipts(paginatedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phiếu nhập: ", error);
    }
  };
  useEffect(() => {
    

    fetchReceipts();
  }, [employee, currentPage, pageSize, searchTerm]); // Thêm searchQuery vào dependency array

  const handleReceiptClick = async (receipt: Receipt) => {
    try {
      if (selectedReceipt && selectedReceipt.id === receipt.id) {
        setSelectedReceipt(null); // Nếu sản phẩm đã được chọn, click lại để ẩn thông tin chi tiết
        setReceiptDetails([]);
      } else {
        const inventoryResponse = await axiosInstance.get(
          API_ROUTES.RECEIPT_DETAILS(receipt.id),
        );
        setReceiptDetails(inventoryResponse.data);
        setSelectedReceipt(receipt);
      }
    } catch (error) {
      console.error("Error fetching receipt details: ", error);
    }
  };

  const handleOpenReceipt = (receipt: Receipt) => {
    // Chuyển hướng đến trang cập nhật và truyền dữ liệu
    router.push(`/deliverynotes/add?id=${receipt.id}`);
  };
  const handleCancelReceipt = async (receiptId: number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, hủy nó!",
        cancelButtonText: "Không",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(
          `http://localhost:8888/v1/api/receipts/${receiptId}`,
        );
        Swal.fire("Đã hủy!", "Phiếu nhập đã bị hủy.", "success");
        setReceipts((prevReceipts) =>
          prevReceipts.filter((r) => r.id !== receiptId),
        );

        fetchReceipts();
      }
    } catch (error) {
      console.error("Error canceling receipt: ", error);
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi hủy phiếu nhập.", "error");
    }
  };

  const totalQuantity = receiptDetails.reduce(
    (acc, detail) => acc + detail.quantity,
    0,
  );
  const totalItems = receiptDetails.length;
  const totalPrice = receiptDetails.reduce(
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
            <h4 className="text-3xl text-3xl font-semibold text-black dark:text-white">
              NHẬP HÀNG
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
            <Link href="/receipts/add">
              <button className="rounded bg-green-600 px-4 py-2 text-white">
                Tạo phiếu nhập
              </button>
            </Link>
            {/* <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button> */}
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 font-bold text-white ">
          <div className="col-span-4  ml-6">Mã nhập hàng</div>
          <div className="col-span-2 ">Thời gian</div>
          <div className="col-span-2 ">Nhà cung cấp</div>
          <div className="col-span-2 ">Giá nhập</div>
          <div className="col-span-2 ">Trạng thái</div>
        </div>
      </div>

      {paginatedReceipts.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleReceiptClick(receipt)}
              >
                <CheckboxTwo />
                <p className="mr-3 text-sm font-bold text-black text-blue-800 dark:text-white">
                  PN000{receipt.id}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {format(receipt.date, "dd/MM/yyyy - HH:mm:ss")}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {receipt.supplier?.trim() && receipt.supplier !== "Chuyển kho"
                    ? receipt.supplier
                    : receipt.warehouseTransfer}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {formatCurrency(receipt.price)} 
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{receipt.status}</p>
              </div>
            </div>
          </div>

          {selectedReceipt && selectedReceipt.id === receipt.id && (
            <div className="border border-blue-700 px-4 py-4.5 text-sm text-black dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block  py-2 text-2xl font-bold text-blue-500 dark:text-white">
                      Thông tin
                    </label>

                    <ul className="list-none p-2">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Mã nhập hàng:{" "}
                        <span className="font-bold text-blue-600">
                          PN000{selectedReceipt.id}
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
                        <span className="font-bold">
                          {" "}
                          {receipt.supplier?.trim() &&
                          receipt.supplier !== "Chuyển kho"
                            ? receipt.supplier
                            : receipt.warehouseTransfer}
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
                        Người nhập hàng:{" "}
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

                <div className="container mx-auto border border-blue-500 bg-blue-50">
                  <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-600 py-4.5 font-bold text-white">
                    <div className="col-span-4 ml-6 ">Mã mặt hàng</div>
                    <div className="col-span-2 ">Tên hàng</div>
                    <div className="col-span-2 ">Số lượng</div>
                    <div className="col-span-2 ">Đơn giá</div>
                    <div className="col-span-2 ">Thành tiền</div>
                  </div>

                  {receiptDetails.map((detail) => (
                    <div
                      className="grid grid-cols-12 gap-4 border-b border-stroke py-2"
                      key={detail.productId}
                    >
                      <div className="col-span-4 px-6 text-blue-500">
                        MH000{detail.productId}
                      </div>
                      <div className="col-span-2">{detail.nameProduct}</div>
                      <div className="col-span-2">{detail.quantity}</div>
                      <div className="col-span-2">{formatCurrency(detail.purchasePrice)}</div>
                      <div className="col-span-2">
                        {formatCurrency(detail.purchasePrice * detail.quantity)}
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
                          Tổng tiền:{" "}
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
                  <div className="col-span-5 flex justify-end px-2">
                    {/* <button
                      onClick={() => handleOpenReceipt(receipt)}
                      className="mr-2 rounded bg-green-600 px-4 py-2 text-white"
                    >
                      Mở phiếu
                    </button> */}
                    {receipt.status !== "Đã trả toàn bộ" &&
                      receipt.supplier !== "Chuyển kho" && (
                        <button
                          className="mr-2 rounded bg-green-600 px-4 py-2 text-white"
                          onClick={() => handleOpenReceipt(receipt)}
                        >
                          Trả nhập hàng
                        </button>
                      )}
                    {receipt.status !== "Tồn tại trả hàng" &&
                      receipt.status !== "Đã trả toàn bộ" && (
                        <button
                          className="hover:bg-red-700 rounded bg-red px-4 py-2 font-bold text-white"
                          onClick={() =>
                            handleCancelReceipt(selectedReceipt.id)
                          }
                        >
                          Hủy
                        </button>
                      )}{" "}
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

export default TableReceipt;
