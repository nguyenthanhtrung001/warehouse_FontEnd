"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaWarehouse } from "react-icons/fa";
import axios from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEmployeeStore } from '@/stores/employeeStore';

// Định nghĩa kiểu cho sản phẩm
interface ProductDetail {
  id: number;
  nameProduct: string;
  quantity: number;
  bath: {
    batchName: string;
  };
  productId: number;
}

// Định nghĩa kiểu cho đơn chuyển kho
interface TransferOrder {
  id: number;
  deliveryDate: string;
  status: number; // Thêm status để phân biệt trạng thái đơn
  warehouseSource: {
    warehouseName: string;
    id: number;
  };
  warehouseDestination: {
    warehouseName: string;
    id: number;
  } | null;
}

// Định nghĩa kiểu cho vị trí lưu trữ
interface Location {
  id: number;
  warehouseLocation: string;
}

const ITEMS_PER_PAGE = 10;

const OrderApprovalPage = () => {
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1); // Tab trạng thái
  const { employee } = useEmployeeStore();
  

  // Gọi API để lấy danh sách đơn chuyển kho
  const fetchOrders = () => {
    if (!employee || !employee.warehouseId) return;
    axios.get(`http://localhost:8888/v1/api/deliveryNotes/import-transfer?warehouseId=${employee?.warehouseId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error("Error fetching transfer orders:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi lấy danh sách đơn chuyển kho.", "error");
      });
  };
  
  
  useEffect(() => {
    fetchOrders();
  }, [employee]);

  // Lọc đơn chuyển kho theo trạng thái
  const filteredOrders = orders.filter(order => order.status === activeTab);

  // Tính toán số trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Hàm định dạng ngày giờ theo định dạng dd/MM/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  // Hàm lấy chi tiết sản phẩm cho một đơn hàng cụ thể
  const fetchOrderDetails = (orderId: number) => {
    axios.get(`http://localhost:8888/v1/api/deliveryNotes/${orderId}/details`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("Error fetching order details:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi lấy chi tiết đơn hàng.", "error");
      });
  };

  // Hàm lấy vị trí lưu trữ
  const fetchLocations = () => {
    axios.get('http://localhost:8888/v1/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi lấy vị trí lưu trữ.", "error");
      });
  };

  // Hàm xử lý chấp nhận đơn
  const acceptOrder = () => {
    if (!selectedLocation) {
      Swal.fire("Warning", "Vui lòng chọn vị trí lưu trữ trước khi chấp nhận.", "warning");
      return;
    }

    if (selectedOrder) {
      // Chuẩn bị payload dựa trên thông tin đơn chuyển hiện tại
      const payload = {
        employeeId: 3, // Thay thế ID nhân viên phù hợp
         import_Export_Details: productDetails.map(detail => ({
          product_Id: detail.productId,
          quantity: detail.quantity

        })),
        location: selectedLocation,
        deliveryNote: selectedOrder.id,
        warehouseId: selectedOrder.warehouseSource.id, // ID kho nguồn từ đơn chuyển
        warehouseDestination: selectedOrder.warehouseDestination?.id || null, // ID kho đích từ đơn chuyển
        expiryDate: new Date().toISOString() // Ví dụ: lấy ngày hiện tại làm expiryDate
      };
      console.log("data: ", JSON.stringify(payload, null, 2));
      // Gửi POST API
      axios.post('http://localhost:8888/v1/api/receipts/transfer', payload)
        .then(response => {
          Swal.fire("Success", "Đơn chuyển kho đã được chấp nhận và dữ liệu đã được gửi.", "success");
          // Cập nhật danh sách đơn chuyển kho
          fetchOrders();
          const updatedOrders = orders.filter((order) => order.id !== selectedOrder.id);
          setOrders(updatedOrders);
          setSelectedOrder(null);
        })
        .catch(error => {
          console.error("Error posting receipt:", error);
          Swal.fire("Error", "Có lỗi xảy ra khi gửi dữ liệu.", "error");
        });
    }
  };


  // Hàm xử lý từ chối đơn
  const rejectOrder = () => {
    if (!selectedOrder) return;

    axios.post(` http://localhost:8888/v1/api/deliveryNotes/cancel-transfer/${selectedOrder.id}`, {reason: rejectionReason })
      .then(() => {
        Swal.fire("Success", "Đơn đã bị từ chối.", "success");
        setOrders(prevOrders => prevOrders.map(order => order.id === selectedOrder.id ? { ...order, status: 2 } : order));
        setShowRejectModal(false);
        setSelectedOrder(null);
       
      })
      .catch(error => {
        console.error("Error rejecting order:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi từ chối đơn.", "error");
      });
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-lg text-black">
      <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">
        DANH SÁCH ĐƠN CHUYỂN KHO
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => {
            setActiveTab(1);
            setCurrentPage(1);
          }}
        >
          Chờ Xử Lý
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => {
            setActiveTab(2);
            setCurrentPage(1);
          }}
        >
          Đã Xử Lý
        </button>
      </div>

      {/* Danh sách đơn chuyển kho */}
      <div className="mb-8">
        {paginatedOrders.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-200">
              <tr>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">STT</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Mã Chuyển Kho</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Từ</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Đến</th>
                <th className="py-3 px-4 text-center text-blue-700 font-semibold">Ngày Chuyển</th>
                <th className="py-3 px-4 text-center text-blue-700 font-semibold"></th>
                </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    fetchOrderDetails(order.id);
                    fetchLocations();
                  }}
                >
                  <td className="py-2 px-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="py-2 px-4">CK-{order.id}</td>
                  <td className="py-2 px-4">{order.warehouseSource.warehouseName}</td>
                  <td className="py-2 px-4">{order.warehouseDestination?.warehouseName || "N/A"}</td>
                  <td className="py-2 px-4 text-center">{formatDate(order.deliveryDate)}</td>
                  {activeTab === 2 ? <span className="text-green-700 font-bold" > Đã nhập kho</span> : <p className="text-green-700 font-bold">  </p>}
                
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-lg">Không có đơn chuyển kho nào.</p>
        )}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-200"}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal chi tiết đơn chuyển kho */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chi Tiết Đơn Chuyển Kho #{selectedOrder.id}
            </h2>

            {/* Bảng chi tiết sản phẩm */}
            <table className="min-w-full bg-blue-50 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-700 font-semibold">Tên Sản Phẩm</th>
                  <th className="py-3 px-4 text-center text-blue-700 font-semibold">Số Lượng</th>
                  <th className="py-3 px-4 text-center text-blue-700 font-semibold">Lô Hàng</th>
                </tr>
              </thead>
              <tbody>
                {productDetails.map((detail) => (
                  <tr key={detail.id} className="border-b hover:bg-blue-100 transition-colors">
                    <td className="py-2 px-4">{detail.nameProduct}</td>
                    <td className="py-2 px-4 text-center">{detail.quantity}</td>
                    <td className="py-2 px-4 text-center">{detail.bath.batchName}</td>
                  </tr>
                ))}
              </tbody>
            </table>

           {/* Chọn vị trí lưu trữ */}
          {activeTab === 1 && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700 font-semibold">Chọn Vị Trí Lưu Trữ:</label>
              <select
                value={selectedLocation || ''}
                onChange={(e) => setSelectedLocation(Number(e.target.value))}
                className="w-full p-2 border border-blue-300 rounded-lg"
              >
                <option value="">Chọn vị trí</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.warehouseLocation}
                  </option>
                ))}
              </select>
            </div>
          )}


              {/* Nút hành động */}
      <div className="flex justify-end mt-4 space-x-4">
        {activeTab === 1 && (
          <>
            <button
              onClick={acceptOrder}
              className="bg-green-500 text-white px-5 py-2 rounded-lg transition-colors hover:bg-green-600 shadow-md"
            >
              <FaCheck className="mr-2" /> Xác Nhận
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="bg-red text-white px-5 py-2 rounded-lg transition-colors hover:bg-red-600 shadow-md"
            >
              <FaTimes className="mr-2" /> Từ Chối
            </button>
          </>
        )}
        <button
          onClick={() => setSelectedOrder(null)}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors hover:bg-gray-600 shadow-md"
        >
          Đóng
        </button>
      </div>

                </div>
              </div>
            )}

      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Nhập Lý Do Từ Chối</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg mb-4"
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={rejectOrder}
                className="bg-red text-white px-4 py-2 rounded-lg transition-colors hover:bg-red-600"
              >
                Xác Nhận Từ Chối
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderApprovalPage;
