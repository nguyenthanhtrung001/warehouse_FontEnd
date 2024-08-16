"use client";
import React, { useEffect, useState } from 'react';
import { Receipt } from "@/types/receipt";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation cho Next.js 13
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
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
        const response = await axiosInstance.get(API_ROUTES.RECEIPTS);
         const receiptList = await Promise.all(response.data.map(async (item: any) => {
          return {
            id: item.id,
            date: new Date(item.receiptDate),  // Convert to Date object
            supplier: item.supplier.supplierName,
            price: item.purchasePrice,
            employee: item.employeeId,
            status: 
              item.status === 1 ? "Đã nhập" :
                item.status === 2 ? "Tồn tại trả hàng" :
                 item.status === 3 ? "Đã trả toàn bộ":
                  item.status === 0 ? "Đã hủy" : "Không xác định",
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
        const inventoryResponse = await axiosInstance.get(API_ROUTES.RECEIPT_DETAILS(receipt.id));
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
        title: 'Bạn có chắc chắn?',
        text: "Bạn không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, hủy nó!',
        cancelButtonText: 'Không'
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`http://localhost:8888/v1/api/receipts/${receiptId}`);
        Swal.fire('Đã hủy!', 'Phiếu nhập đã bị hủy.', 'success');
        setReceipts((prevReceipts) =>
          prevReceipts.filter((r) => r.id !== receiptId)
        );
      }
    } catch (error) {
      console.error("Error canceling receipt: ", error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi hủy phiếu nhập.', 'error');
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
            <h4 className="text-3xl font-semibold text-black dark:text-white text-3xl">
              NHẬP HÀNG
            </h4>
          </div>
          <div className="col-span-3 px-2 font-bold">
            <Link href="/receipts/add">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Tạo phiếu nhập
              </button>
            </Link>   
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div>
       
      </div>
      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold ">
          <div className="col-span-4  ml-6">Mã nhập hàng</div>
          <div className="col-span-2 ">Thời gian</div>
          <div className="col-span-2 ">Nhà cung cấp</div>
          <div className="col-span-2 ">Giá nhập</div>
          <div className="col-span-2 ">Trạng thái</div>
        </div>
      </div>

      {receipts.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1 text-black">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center" onClick={() => handleReceiptClick(receipt)}>
                <CheckboxTwo />
                <p className="text-sm text-black dark:text-white mr-3 text-blue-800 font-bold">PN000{receipt.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{format(receipt.date, 'dd/MM/yyyy - HH:mm:ss')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{receipt.supplier}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{receipt.price}VND</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{receipt.status}</p>
              </div>
            </div>
          </div>

          {selectedReceipt && selectedReceipt.id === receipt.id && (
            <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 text-sm text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block  text-blue-500 dark:text-white font-bold text-2xl py-2">
                      Thông tin
                    </label>
                    <ul className="list-none p-2">
                      <li className="mb-2 border-b border-gray-300 pb-2">Mã nhập hàng: <span className="font-bold text-blue-600">PN000{selectedReceipt.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Thời gian: <span className="font-bold">{format(receipt.date, 'dd/MM/yyyy - HH:mm:ss')}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Nhà cung cấp: <span className="font-bold">{receipt.supplier}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-14">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Trạng thái: <span className="font-bold text-blue-500">{receipt.status}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Người nhập hàng: <span className="font-bold">NV000{receipt.employee}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-12">
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

                <div className="container mx-auto bg-blue-50 border border-blue-500">
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
                     <div className="col-span-2">{detail.purchasePrice * detail.quantity}</div>
                   </div>
                  ))}

                  <div className="grid grid-cols-12 mt-3 py-2">
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
                  <div className="col-span-7"></div>
                  <div className="col-span-5 px-2 flex justify-end">
                    <button
                      onClick={() => handleOpenReceipt(receipt)}
                      className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                      Mở phiếu
                    </button>
                    {receipt.status !== "Đã trả toàn bộ"   && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => handleOpenReceipt(receipt)}
            >
              Trả nhập hàng
            </button>
          )}
          {receipt.status !== "Tồn tại trả hàng" && receipt.status !== "Đã trả toàn bộ"  && (
            <button
              className="px-4 py-2 bg-red hover:bg-red-700 text-white font-bold rounded"
              onClick={() => handleCancelReceipt(selectedReceipt.id)}
            >
              Hủy
            </button>
          )}  </div>
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
