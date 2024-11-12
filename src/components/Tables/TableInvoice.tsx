"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation cho Next.js 13
import Link from 'next/link';
import SearchInput from '@/components/Search/SearchInputProps';
import DateFilter from '@/components/Search/DateFilter';
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance';
import { format } from 'date-fns';
import { useEmployeeStore } from '@/stores/employeeStore';

const TableInvoice = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const { employee } = useEmployeeStore();

  

  const fetchInvoices = useCallback(async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get(API_ROUTES.INVOICES_WAREHOUSE(employee?.warehouseId));
      console.error("data invoices: ", employee?.warehouseId);
      const invoiceList = response.data
        .filter((item: any) => {
          const printDate = new Date(item.printDate);
          const searchLower = searchTerm.toLowerCase();
          return (
            (!startDate || printDate >= startDate) &&
            (!endDate || printDate <= endDate) &&
            (item.id.toString().includes(searchTerm) || searchLower === '' || item.customer.customerName.toLowerCase().includes(searchLower))
          );
        })
        .map((item: any) => ({
          id: item.id,
          printDate: new Date(item.printDate),
          // customerName: item.customer.customerName,
          // phoneNumber: item.customer.phoneNumber,
          // address: item.customer.address,
          // note: item.customer.note,
          price: item.price,
          employee: item.employeeId,
          status: item.status === 2 ? "Đã thanh toán" : "Tồn tại trả",
        }));
      setInvoices(invoiceList);
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  }, [startDate, endDate, searchTerm,employee]);

  const handleInvoiceClick = async (invoice: any) => {
    try {
      if (selectedInvoice && selectedInvoice.id === invoice.id) {
        setSelectedInvoice(null);
        setInvoiceDetails([]);
      } else {
        const response = await axiosInstance.get(`${API_ROUTES.INVOICE_DETAILS}/${invoice.id}`);
        setInvoiceDetails(response.data);
        setSelectedInvoice(invoice);
      }
    } catch (error) {
      console.error("Error fetching invoice details: ", error);
    }
  };

  const handleOpenInvoice = (invoice: any) => {
    router.push(`/invoice/return?id=${invoice.id}`);
  };

  const totalQuantity = invoiceDetails.reduce((acc, detail) => acc + detail.quantity, 0);
  const totalItems = invoiceDetails.length;
  const totalPrice = invoiceDetails.reduce((acc, detail) => acc + detail.purchasePrice * detail.quantity, 0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    fetchInvoices();
  }, [startDate, endDate, searchTerm, fetchInvoices]);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-xl font-semibold text-black dark:text-white mt-1">
              DANH SÁCH HÓA ĐƠN
            </h4>
            
          </div>
          <div className="col-span-5 flex items-center">
          <SearchInput searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          placeholder="Nhập mã hóa đơn hoặc tên khách hàng" />
        
          </div>
              <div className="col-span-1 px-1"></div>
                  <div className="col-span-3 px-2">
                      <Link href="/invoices/add">
                          <button className="bg-green-600 text-white px-4 py-2 rounded">
                              Tạo hóa đơn
                          </button>
                      </Link>
                      <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
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
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white">
          <div className="col-span-2 font-medium ml-4">Mã hóa đơn</div>
          <div className="col-span-3 font-medium">Thời gian</div>
          <div className="col-span-3 font-medium">Khách hàng</div>
          <div className="col-span-2 font-medium">Tổng tiền</div>
          <div className="col-span-2 font-medium">Trạng thái</div>
        </div>
      </div>

      {invoices.map((invoice) => (
        <React.Fragment key={invoice.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center ml-4" onClick={() => handleInvoiceClick(invoice)}>
                <p className="text-sm text-black dark:text-white mr-3 text-blue-800 font-bold">HD000{invoice.id}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white mt-2">{format(invoice.printDate, 'dd/MM/yyyy - HH:mm:ss')}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white mt-2">{invoice.customerName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{formatCurrency(invoice.price)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{invoice.status}</p>
              </div>
            </div>
          </div>

          {selectedInvoice && selectedInvoice.id === invoice.id && (
            <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 text-xm  text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block p-2 text-blue-800 dark:text-black font-bold text-2xl">
                      Thông tin
                    </label>
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Mã hóa đơn: <span className="font-bold text-blue-700">HD000{selectedInvoice.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Thời gian: <span className="font-bold">{format(invoice.printDate, 'dd/MM/yyyy - HH:mm:ss')}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Trạng thái: <span className="font-bold text-blue-500">{invoice.status}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-12">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Khách hàng: <span className="font-bold">{invoice.customerName}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">SĐT: <span className="font-bold ">{invoice.phoneNumber}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Địa chỉ: <span className="font-bold">{invoice.address}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-12">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Ghi chú: <span className="font-bold">{invoice.note}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Người tạo hóa đơn: <span className="font-bold">NV000{invoice.employee}</span></li>
                    </ul>
                  </div>
                </div>

                <div className="container mx-auto mt-2 border border-blue-500 bg-blue-50">
                  <div className="grid grid-cols-12 gap-4  py-4.5 bg-blue-600 font-bold text-white">
                    <div className="col-span-4 ml-6">Mã mặt hàng</div>
                    <div className="col-span-2">Tên mặt hàng</div>
                    <div className="col-span-2">Số lượng</div>
                    <div className="col-span-2">Đơn giá</div>
                    <div className="col-span-2">Thành tiền</div>
                  </div>

                  {invoiceDetails.map((detail) => (
                    <div className="grid grid-cols-12 gap-4 py-2 border-b border-stroke" key={detail.productId}>
                      <div className="col-span-4 px-6 text-blue-500">MH000{detail.productId}</div>
                      <div className="col-span-2">{detail.nameProduct}</div>
                      <div className="col-span-2">{detail.quantity}</div>
                      <div className="col-span-2">{formatCurrency(detail.purchasePrice)}</div>
                      <div className="col-span-2">{formatCurrency(detail.purchasePrice * detail.quantity)}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-12 mt-3 py-2 text-black">
                    <div className="col-span-9"></div>
                    <div className="col-span-3">
                      <ul className="list-none p-0">
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng số lượng: <span className="font-bold ml-3">{totalQuantity}</span></li>
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng mặt hàng: <span className="font-bold ml-3">{totalItems}</span></li>
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng tiền: <span className="font-bold text-blue-500 ml-3">{formatCurrency(totalPrice)}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 mt-3 py-6">
                  <div className="col-span-8"></div>
                  <div className="col-span-4 px-2 font-bold flex justify-end">
                    {invoice.status === "Đã thanh toán" && (
                      <button
                        onClick={() => handleOpenInvoice(invoice)}
                        className="bg-green-600 text-white px-4 py-2 rounded mr-2 w-30"
                      >
                        Trả Hàng
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

export default TableInvoice;
