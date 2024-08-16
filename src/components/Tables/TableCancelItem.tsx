"use client";
import React, { useEffect, useState } from 'react';
import { Receipt } from "@/types/receipt";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation cho Next.js 13
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const TableReceipt = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptDetails, setReceiptDetails] = useState<any[]>([]);
  const router = useRouter(); // Khai báo useRouter

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.CANCEL_DELIVERY_NOTE);
        const receiptList = await Promise.all(response.data.map(async (item: any) => {
          return {
            id: item.id,
            date: new Date(item.deliveryDate),  // Convert to Date object
            // supplier: item.receipt.supplier.supplierName,
            price: item.price,
            status: item.status === 1 ? "Đã hủy kho" : "Đã hủy phiếu",
            employee: item.employeeId,
          };
        }));
        setReceipts(receiptList);
      } catch (error) {
        console.error("Error fetching receipts: ", error);
      }
    };

    fetchReceipts();
  }, []);

  const handleReceiptClick = async (receipt: Receipt) => {
    try {
      if (selectedReceipt && selectedReceipt.id === receipt.id) {
        setSelectedReceipt(null); // Nếu sản phẩm đã được chọn, click lại để ẩn thông tin chi tiết
        setReceiptDetails([]);
      } else {
        const inventoryResponse = await axiosInstance.get(API_ROUTES.DELIVERY_NOTE_DETAILS(receipt.id));
        setReceiptDetails(inventoryResponse.data);
        setSelectedReceipt(receipt);
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
        title: 'Bạn có chắc chắn muốn hủy phiếu này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, hủy phiếu!',
        cancelButtonText: 'Không',
      });
  
      if (result.isConfirmed) {
        await axiosInstance.delete(`http://localhost:8888/v1/api/deliveryNotes/${id}`);
  
        Swal.fire({
          title: 'Đã hủy!',
          text: 'Phiếu đã được hủy thành công!',
          icon: 'success',
        });
  
        // Cập nhật lại danh sách phiếu sau khi hủy
        setReceipts(receipts.filter((receipt) => receipt.id !== id));
        setSelectedReceipt(null);
        setReceiptDetails([]);
      }
    } catch (error) {
      console.error('Error cancelling receipt: ', error);
  
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi hủy phiếu!',
        icon: 'error',
      });
    }
  };
  
  
  

  const totalQuantity = receiptDetails.reduce((acc, detail) => acc + detail.quantity, 0);
  const totalItems = receiptDetails.length;
  const totalPrice = receiptDetails.reduce((acc, detail) => acc + detail.purchasePrice * detail.quantity, 0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              HỦY HÀNG
            </h4>
          </div>
          <div className="col-span-3 px-2 font-bold">
            <Link href="/remove-Items/add">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Tạo phiếu hủy
              </button>
            </Link>   
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div>
       
      </div>
      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold ">
          <div className="col-span-4  ml-6">Mã hủy hàng</div>
          <div className="col-span-4 ">Thời gian</div>
          {/* <div className="col-span-2 ">Trả nhà cung cấp</div> */}
          {/* <div className="col-span-3 ">Giá xuất</div> */}
          <div className="col-span-4 ">Trạng thái</div>
        </div>
      </div>

      {receipts.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center" onClick={() => handleReceiptClick(receipt)}>
                <CheckboxTwo />
                <p className="text-sm text-black dark:text-white mr-3 text-blue-800 font-bold">PHH000{receipt.id}</p>
              </div>
              <div className="col-span-4">
                <p className="text-sm text-black dark:text-white mt-2">
                {format(receipt.date, 'dd/MM/yyyy - HH:mm:ss')}
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

          {selectedReceipt && selectedReceipt.id === receipt.id && (
            <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 text-xm text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block font-bold text-2xl p-2 text-blue-500 dark:text-white">
                      Thông tin
                    </label>
                    <ul className="list-none p-2 ">
                      <li className="mb-2 border-b border-gray-300 pb-2">Mã phiếu hủy: <span className="font-bold text-blue-700">PHH000{selectedReceipt.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">
                        Thời gian:
                        <span className="font-bold">
                        {format(receipt.date, 'dd/MM/yyyy - HH:mm:ss')}  </span>
                      </li> <li className="mb-2 border-b border-gray-300 pb-2">Cân bằng kho: <span className="font-bold text-blue-500">Đã cân bằng kho</span></li>
                   
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-14">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Trạng thái: <span className="font-bold text-blue-500">{receipt.status}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Người hủy hàng: <span className="font-bold">NV000{receipt.employee}</span></li>
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

                <div className="container mx-auto bg-blue-50 border border-blue-600">
                  <div className="grid grid-cols-12 gap-4 border-t border-stroke py-4.5 bg-blue-600 font-bold text-white">
                    <div className="col-span-4 ml-6 ">Mã mặt hàng</div>
                    <div className="col-span-2 ">Tên hàng</div>
                    <div className="col-span-2 ">Số lượng</div>
                    <div className="col-span-2 ">Đơn giá</div>
                    <div className="col-span-2 ">Thành tiền</div>
                  </div>

                  {receiptDetails.map((detail) => (
                   <div className="grid grid-cols-12 gap-4 py-2 border-b border-stroke" key={detail.productId}>
                     <div className="col-span-4 px-6 text-blue-500">MH000{detail.productId}</div>
                     <div className="col-span-2">{detail.nameProduct}</div>
                     <div className="col-span-2">{detail.quantity}</div>
                     <div className="col-span-2">{detail.purchasePrice}</div>
                     {/* <div className="col-span-2">{detail.purchasePrice * detail.quantity}</div> */}
                   </div>
                  ))}

                  <div className="grid grid-cols-12 mt-3 py-2">
                    <div className="col-span-9"></div>
                    <div className="col-span-3">
                      <ul className="list-none p-0">
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng số lượng: <span className="font-bold ml-3">{totalQuantity}</span></li>
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng mặt hàng: <span className="font-bold ml-3">{totalItems}</span></li>
                        {/* <li className="mb-2 border-b border-gray-300 pb-2">Tổng tiền thiệt hại: <span className="font-bold text-blue-500 ml-3">{formatCurrency(totalPrice)}</span></li> */}
                      </ul>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-12 mt-3 py-6">
                  <div className="col-span-7"></div>
                  <div className="col-span-5 px-2 flex justify-end font-bold">
                    <button
                      onClick={() => handleOpenReceipt(receipt)}
                      className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                      Mở phiếu
                    </button>
                    <button className="bg-red text-white px-4 py-2 rounded"
                    onClick={() => handleCancel(receipt.id)}
                    >Hủy</button>
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

export default TableReceipt;
