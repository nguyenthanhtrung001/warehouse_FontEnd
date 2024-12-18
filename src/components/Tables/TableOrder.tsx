"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho Next.js 13
import Link from "next/link";
import SearchInput from "@/components/Search/SearchInputProps";
import DateFilter from "@/components/Search/DateFilter";
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { encrypt } from "@/utils/cryptoUtils";
import { format } from "date-fns";
import { useEmployeeStore } from "@/stores/employeeStore";
import { handlePrintPDF } from "@/components/PDF/order_PDF";

const TableInvoice = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng mục mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedInvoices, setPaginatedInvoices] = useState<any[]>([]);

  const fetchInvoices = useCallback(async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get(
        API_ROUTES.INVOICES_BY_STATUS(1, employee?.warehouseId),
      );
      console.error("data: ", employee?.warehouseId);
      const invoiceList = response.data
        .filter((item: any) => {
          const printDate = new Date(item.printDate);
          const searchLower = searchTerm.toLowerCase();
          return (
            (!startDate || printDate >= startDate) &&
            (!endDate || printDate <= endDate) &&
            (item.id.toString().includes(searchTerm) ||
              searchLower === "" ||
              item.contactInfo.toLowerCase().includes(searchLower))
          );
        })
        .map((item: any) => ({
          id: item.id,
          printDate: new Date(item.printDate),
          contactInfo: item.contactInfo,
          // customerName: item.customer.customerName,
          // phoneNumber: item.customer.phoneNumber,
          // address: item.customer.address,
          employee: item.employeeId,
          // note: item.customer.note,
          price: item.price,
          status: item.status === 1 ? "Đã thanh toán" : "Chưa thanh toán",
        }));
        const sorted = invoiceList.sort(
          (a: { printDate: Date }, b: { printDate: Date }) => b.printDate.getTime() - a.printDate.getTime(),
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

  const handleInvoiceClick = async (invoice: any) => {
    try {
      if (selectedInvoice && selectedInvoice.id === invoice.id) {
        setSelectedInvoice(null);
        setInvoiceDetails([]);
      } else {
        const response = await axiosInstance.get(
          `${API_ROUTES.INVOICE_DETAILS}/${invoice.id}`,
        );
        setInvoiceDetails(response.data);
        setSelectedInvoice(invoice);
        console.log("Data:", JSON.stringify(response.data, null,2));
      }
    } catch (error) {
      console.error("Error fetching invoice details: ", error);
    }
  };
  const handleCancelOrder = async (invoiceId: number) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận hủy đơn hàng",
        text: "Bạn chắc chắn muốn hủy đơn hàng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hủy",
        cancelButtonText: "Quay lại",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`${API_ROUTES.INVOICES}/${invoiceId}`);
        Swal.fire("Hủy thành công!", "Đơn hàng đã được hủy.", "success");
        fetchInvoices(); // Cập nhật danh sách đơn hàng
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
  }, [startDate, endDate, searchTerm, fetchInvoices]);

  const handlePayment = (invoiceId: number) => {
    const encryptedId = encrypt(invoiceId.toString());
    router.push(`/order/confirm?orderId=${encodeURIComponent(encryptedId)}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="mt-1 text-xl font-semibold text-black dark:text-white">
              DANH SÁCH ĐƠN HÀNG
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
          <div className="col-span-1 px-1"></div>
          <div className="col-span-3 px-2 flex justify-end">
            <Link href="/order/add">
              <button className="rounded bg-green-600 px-4 py-2 text-white">
                Đặt hàng
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
          <div className="col-span-2 ml-4 font-medium">Mã đơn đặt</div>
          <div className="col-span-3 font-medium">Thời gian</div>
          <div className="col-span-3 font-medium">Thông tin đơn hàng</div>
          <div className="col-span-2 font-medium">Tổng tiền</div>
          <div className="col-span-2 font-medium"></div>
        </div>
      </div>

      {paginatedInvoices.map((invoice) => (
        <React.Fragment key={invoice.id}>
          <div className="border-gray-200 container mx-auto mb-1 border-b p-1 px-4 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-2 ml-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleInvoiceClick(invoice)}
              >
                <p className="mr-3 text-sm font-bold text-black text-blue-800 dark:text-white">
                  DH000{invoice.id}
                </p>
              </div>
              <div className="col-span-3">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {format(invoice.printDate, "dd/MM/yyyy - HH:mm:ss")}
                </p>
              </div>
              <div className="col-span-3">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {invoice.contactInfo}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mt-2 text-sm text-black dark:text-white">
                  {formatCurrency(invoice.price)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-bold text-meta-3">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white"
                    onClick={() => handlePayment(invoice.id)}
                  >
                    Thanh Toán
                  </button>
                </p>
              </div>
            </div>
          </div>

          {selectedInvoice && selectedInvoice.id === invoice.id && (
            <div className="text-xm border border-blue-700 px-4 py-4.5 text-black dark:border-strokedark md:px-6  2xl:px-7.5">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block p-2 text-2xl font-bold text-blue-800 dark:text-black">
                      Thông tin
                    </label>
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Mã hóa đơn:{" "}
                        <span className="font-bold text-blue-700">
                          DH000{selectedInvoice.id}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Thời gian:
                        <span className="font-bold">
                          {format(invoice.printDate, "dd/MM/yyyy - HH:mm:ss")}{" "}
                        </span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Trạng thái:{" "}
                        <span className="font-bold text-blue-500">
                          {invoice.status}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-12 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-4">
                        Thông tin đơn hàng: <br />{" "}
                        <span className="font-bold">{invoice.contactInfo}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-4 mt-12 p-2">
                    <ul className="list-none p-0">
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Ghi chú:{" "}
                        <span className="font-bold">{invoice.note}</span>
                      </li>
                      <li className="border-gray-300 mb-2 border-b pb-2">
                        Người tạo hóa đơn:{" "}
                        <span className="font-bold">
                          NV000{invoice.employee}
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
                      <div className="col-span-4 px-6 font-bold text-blue-500">
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
                          Tổng tiền:{" "}
                          <span className="ml-3 font-bold text-blue-500">
                            {formatCurrency(totalPrice)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-12 py-6">
                  <div className="col-span-8"></div>
                  <div className="col-span-4 flex justify-end px-2 font-bold">
                    <button
                      onClick={() => handleCancelOrder(selectedInvoice.id)}
                      className="mt-4 rounded bg-red px-4 py-2 text-white"
                    >
                      Hủy Đơn
                    </button>
                    <button
                      className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
                      onClick={() => handlePrintPDF(invoice, invoiceDetails)} // Gọi hàm in PDF
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

export default TableInvoice;
