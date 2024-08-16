"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";

const PaymentConfirmation: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const encryptedId = searchParams.get("orderId");
  const router = useRouter(); 

  useEffect(() => {
    if (encryptedId) {
      const decryptedId = decrypt(decodeURIComponent(encryptedId));
      setOrderId(decryptedId);
    }
  }, [encryptedId]);

  const handlePayment = async () => {
    if (orderId) {
      const confirmPayment = await Swal.fire({
        title: 'Xác nhận thanh toán',
        text: "Bạn có chắc chắn muốn tiến hành thanh toán cho đơn hàng này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      });

      if (confirmPayment.isConfirmed) {
        try {
          const response = await axiosInstance.put(API_ROUTES.UPDATE_INVOICE_STATUS(Number(orderId)), { newStatus: 1 }); // Giả sử trạng thái mới là 1

          if (response.status === 200 || response.status === 204) {
            Swal.fire({
              title: "Thành công!",
              text: "Thanh toán đã được xác nhận.",
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => {
              // Sau khi người dùng nhấn OK, chuyển hướng đến trang tạo hóa đơn
              const encryptedOrderId = encodeURIComponent(encrypt(orderId)); // Mã hóa ID đơn hàng
              router.push(`/order/invoice?orderId=${encryptedOrderId}`);
            });
          } else {
            Swal.fire({
              title: "Thất bại!",
              text: "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
          Swal.fire({
            title: "Thất bại!",
            text: "Lỗi kết nối.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy ID đơn hàng.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handlePaymentDeplay = async () => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận thanh toán sau',
        text: 'Bạn có chắc chắn muốn thanh toán sau không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        router.push('/order');
      }
    } catch (error) {
      console.error('Error during payment delay confirmation:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi trong quá trình xác nhận.',
        'error'
      );
    }
  };

  return (
    <div className="flex mt-10 justify-center w-full h-300 bg-gray-100">
      <div className="p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center text-black">
          Xác nhận thanh toán
        </h1>
        <p className="mt-2 text-center text-gray-700">
          {orderId ? (
            <>
              <h1 className="text-2xl font-bold text-center text-green-700 mb-5">
                ID: DH000<strong>{orderId}</strong>
              </h1>
              <span className="mt-10">
                Đơn đặt hàng đã được tạo thành công. Vui lòng tiến hành thanh toán để hoàn tất.
              </span>
            </>
          ) : (
            "Không tìm thấy ID đơn hàng."
          )}
        </p>
        <div className="flex space-x-4 mt-4">
          <button
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={handlePayment}
          >
            Tiến hành thanh toán
          </button>
          <button
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handlePaymentDeplay}
          >
            Thanh Toán Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
