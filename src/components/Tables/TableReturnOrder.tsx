"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho Next.js 13
import Link from "next/link";
import SearchInput from "@/components/Search/SearchInputProps";
import DateFilter from "@/components/Search/DateFilter";
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useEmployeeStore } from "@/stores/employeeStore";
import { handlePrintPDF } from "../PDF/return_order_PDF";
import { Console } from "console";

const TableReturnOrder = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedInvoices, setPaginatedInvoices] = useState<any[]>([]);

  const fetchInvoices = useCallback(async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get(
        `http://localhost:8888/v1/api/return-notes/warehouse/1`);
        console.log("data: ",response.data)
      const invoiceList = response.data
        .filter((item: any) => {
          const returnDate = new Date(item.returnDate);
          const searchLower = searchTerm.toLowerCase();
          return (
            (!startDate || returnDate >= startDate) &&
            (!endDate || returnDate <= endDate) &&
            (item.id.toString().includes(searchTerm) ||
              searchLower === "" ||
              item.invoice.contactInfo.toLowerCase().includes(searchLower))
          );
        })
        .map((item: any) => ({
          id: item.id,
          returnDate: new Date(item.returnDate),
          contactInfo: item.invoice.contactInfo,
          invoice: item.invoice,
          // customerName: item.customer.customerName,
          // phoneNumber: item.customer.phoneNumber,
          // address: item.customer.address,
          // note: item.customer.note,
          price: item.price,
          employee: item.employeeId,
          status: item.status === 1 ? "Đã trả":"fixxxxx",
        }));
        const sorted = invoiceList.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        );
        
      setInvoices(sorted);

      // Tính toán tổng số trang
      const total = Math.ceil(sorted.length / pageSize);
      setTotalPages(total);

      // Phân trang
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = sorted.slice(startIndex, startIndex + pageSize);
      setPaginatedInvoices(paginatedData);
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  }, [startDate, endDate, searchTerm, employee, currentPage, pageSize]);
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInvoices();
    }, 500); // Delay 500ms sau khi người dùng gõ

    return () => {
      clearTimeout(handler); // Xóa bỏ khi người dùng nhập tiếp
    };
  }, [searchTerm]);
  const handleInvoiceClick = async (returnNote: any) => {
    try {
      if (selectedInvoice && selectedInvoice.id === returnNote.id) {
        setSelectedInvoice(null);
        setInvoiceDetails([]);
      } else {
        console.error("trung" , returnNote.invoice.id);
        const response = await axiosInstance.get(
          API_ROUTES.RETURN_DETAILS_BY_INVOICE_ID(returnNote.invoice.id),
        );
        setInvoiceDetails(response.data);
        setSelectedInvoice(returnNote);
      }
    } catch (error) {
      console.error("Error fetching invoice details: ", error);
    }
  };

  const handleCancel = async (invoiceId: number) => {
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

      console.log("gia tr gui di: ",invoiceId)
      if (result.isConfirmed) {
        await axiosInstance.delete(
          API_ROUTES.DELETE_RETURN_DETAILS_BY_INVOICE_ID(invoiceId),
        );
        fetchInvoices();
        Swal.fire("Hủy thành công!", "Trả hàng đã được hủy.", "success");
      }
    } catch (error) {
      console.error("Error canceling invoice: ", error);
      Swal.fire("Hủy thất bại!", "Đã xảy ra lỗi khi hủy đơn hàng.", "error");
    }
  };

  const totalQuantity = invoiceDetails.reduce(
    (acc, detail) => acc + detail.quantity,
    0,
  );
  const totalItems = invoiceDetails.length;
  const totalPrice = invoiceDetails.reduce(
    (acc, detail) => acc + detail.purchasePrice * detail.quantity,
    0,
  );
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    fetchInvoices();
  }, [startDate, endDate, searchTerm, fetchInvoices, employee]);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="mt-1 text-xl font-semibold text-black dark:text-white">
              DANH SÁCH TRẢ HÀNG (KH)
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
        
          <div className="col-span-3 flex justify-end px-2">
            <Link href="/invoice/return">
              <button className="rounded bg-green-600 px-4 py-2 text-white  flex justify-end">
                Trả hàng (KH)
              </button>
            </Link>
            {/* <button className="ml-2 rounded bg-green-600 px-4 py-2 text-white">
              In PDF
            </button> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 py-2">
        <div className="col-span-5 ml-7">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            fetchInvoices={fetchInvoices}
          />
        </div>
      </div>

      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke bg-blue-700 px-4 py-4.5 text-white">
          <div className="col-span-2 ml-4 font-medium">Mã hóa đơn</div>
          <div className="col-span-3 font-medium">Thời gian</div>
          <div className="col-span-3 font-medium">Thông tin đơn hàng</div>
          <div className="col-span-2 font-medium">Tổng tiền trả</div>
          <div className="col-span-2 font-medium">Trạng thái</div>
        </div>
      </div>

      {paginatedInvoices.map((returnNote) => (
        <React.Fragment key={returnNote.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-2 ml-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleInvoiceClick(returnNote)}
              >
                <p className="mr-3 text-sm font-bold text-black text-blue-800 dark:text-white">
                  TH000{returnNote.id}
                </p>
              </div>
              <div className="col-span-3">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {format(returnNote.returnDate, "dd/MM/yyyy - HH:mm:ss")}
                </p>
              </div>
              <div className="col-span-3">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {returnNote.contactInfo}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {formatCurrency(returnNote.price)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{returnNote.status}</p>
              </div>
            </div>
          </div>

          {selectedInvoice && selectedInvoice.id === returnNote.id && (
            <div className="text-xm border border-blue-700 px-4 py-4.5 text-black dark:border-strokedark md:px-6  2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block p-2 text-2xl font-bold text-blue-800 dark:text-black">
                      Thông tin  TH000{selectedInvoice.id}
                    </label>
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Mã hóa đơn:{" "}
                        <span className="font-bold text-blue-700">
                          HD000{selectedInvoice.invoice.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Thời gian:{" "}
                        <span className="font-bold">
                          {format(returnNote.returnDate, "dd/MM/yyyy - HH:mm:ss")}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Trạng thái:{" "}
                        <span className="font-bold text-blue-500">
                          {returnNote.status}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-12 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-4">
                        Thông tin đơn hàng: <br />{" "}
                        <span className="font-bold">{returnNote.contactInfo}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-12 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ghi chú:{" "}
                        <span className="font-bold">{returnNote.note}</span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Người tạo hóa đơn:{" "}
                        <span className="font-bold">
                          NV000{returnNote.employee}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="container mx-auto mt-2 border border-blue-500 bg-blue-50">
                  <div className="grid grid-cols-12 gap-4  bg-blue-600 py-4.5 font-bold text-white">
                    <div className="col-span-4 ml-6">Mã mặt hàng</div>
                    <div className="col-span-2">Tên mặt hàng</div>
                    <div className="col-span-2">Số lượng</div>
                    <div className="col-span-2">Đơn giá</div>
                    <div className="col-span-2">Thành tiền</div>
                  </div>

                  {invoiceDetails.map((detail) => (
                    <div
                      className="grid grid-cols-12 gap-4 border-b border-stroke py-2"
                      key={detail.productId}
                    >
                      <div className="col-span-4 px-6 text-blue-500">
                        MH000{detail.productId}
                      </div>
                      <div className="col-span-2">{detail.nameProduct}</div>
                      <div className="col-span-2">{detail.quantity}</div>
                      <div className="col-span-2">
                        {formatCurrency(detail.purchasePrice)}
                      </div>
                      <div className="col-span-2">
                        {formatCurrency(detail.purchasePrice * detail.quantity)}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 grid grid-cols-12 py-2 text-black">
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
                          Tổng tiền trả:{" "}
                          <span className="ml-3 font-bold text-blue-500">
                            {formatCurrency(totalPrice)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-12 py-6">
                  <div className="col-span-8"></div>
                  <div className="col-span-4 flex justify-end px-2 font-bold">
                   
                      <button
                        onClick={() => handleCancel(returnNote.invoice.id)}
                        className="mr-2 w-30 rounded bg-red px-4 py-2 text-white"
                      >
                        Hủy trả
                      </button>
                      
                      
                  
                      <button
                      className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
                      onClick={() => handlePrintPDF(returnNote, invoiceDetails)} // Gọi hàm in PDF
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

export default TableReturnOrder;
