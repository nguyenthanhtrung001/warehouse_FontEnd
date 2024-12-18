"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEmployeeStore } from '@/stores/employeeStore';

// Định nghĩa kiểu cho đơn chuyển kho
interface TransferOrder {
  id: number;
  deliveryDate: string;
  status: number; // 1: chờ xác nhận, 0: từ chối
  reason?: string; // Lý do từ chối nếu có
  warehouseSource: {
    warehouseName: string;
    id: number;
  };
  warehouseDestination: {
    warehouseName: string;
    id: number;
  } | null;
}

// Định nghĩa kiểu cho chi tiết sản phẩm
interface ProductDetail {
  id: number;
  nameProduct: string;
  quantity: number;
  bath: {
    batchName: string;
  };
}

const ITEMS_PER_PAGE = 10;

const OrderApprovalPage = () => {
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(1); // Tab trạng thái: 1 (chờ xác nhận), 0 (từ chối)
  const router = useRouter();
  const { employee } = useEmployeeStore();
  

  // Gọi API để lấy danh sách đơn chuyển kho
  useEffect(() => {
    fetchOrders();
  }, [employee]);

  const fetchOrders = () => {
    if (!employee || !employee.warehouseId) return;
    axios.get(`http://localhost:8888/v1/api/deliveryNotes/transfer?warehouseId=${employee?.warehouseId}`)
      .then(response => {
        const sortedOrders = response.data.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);  // Sắp xếp theo id giảm dần
        setOrders(sortedOrders);
        
      })
      .catch(error => {
        console.error("Error fetching transfer orders:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi lấy danh sách đơn chuyển kho.", "error");
      });
  };

  // Hàm xử lý hủy đơn chuyển kho
  const cancelOrder = (orderId: number) => {
    Swal.fire({
      title: "Xác nhận hủy phiếu",
      text: "Bạn có chắc chắn muốn hủy phiếu này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy Phiếu",
      cancelButtonText: "Quay Lại"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8888/v1/api/deliveryNotes/${orderId}`);
          setOrders(orders.filter(order => order.id !== orderId));
          Swal.fire("Đã hủy!", "Phiếu chuyển kho đã bị hủy.", "success");
        } catch (error) {
          console.error("Error canceling order:", error);
          Swal.fire("Error", "Có lỗi xảy ra khi hủy phiếu.", "error");
        }
      }
    });
  };

  // Hàm lấy chi tiết đơn chuyển kho
  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await axios.get(`http://localhost:8888/v1/api/deliveryNotes/${orderId}/details`);
      setProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      Swal.fire("Error", "Có lỗi xảy ra khi lấy chi tiết sản phẩm.", "error");
    }
  };

  // Hàm mở modal và lấy thông tin chi tiết của đơn
  const handleOrderClick = (order: TransferOrder) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setIsModalOpen(true);
  };

  // Lọc đơn theo trạng thái của tab
  const filteredOrders = orders.filter(order => order.status === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-lg text-black">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold text-blue-600">DANH SÁCH ĐƠN CHUYỂN KHO</h1>
        <button
          onClick={() => router.push('/transfer/add')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Thêm Phiếu Chuyển Kho
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => {
            setActiveTab(1);
            setCurrentPage(1);
          }}
        >
          Chờ Xác Nhận
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => {
            setActiveTab(0);
            setCurrentPage(1);
          }}
        >
          Đã Từ Chối
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        {paginatedOrders.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-200">
              <tr>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">STT</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Mã Chuyển Kho</th>
               
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Đến</th>
                <th className="py-3 px-4 text-center text-blue-700 font-semibold">Ngày Chuyển</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 text-center text-blue-700 font-semibold">
                  {activeTab === 1 ? "Tác Vụ" : "Lý Do Từ Chối"}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={order.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="py-2 px-4">CK-{order.id}</td>
                 
                  <td className="py-2 px-4">{order.warehouseDestination?.warehouseName || "N/A"}</td>
                  <td className="py-2 px-4 text-center">{formatDate(order.deliveryDate)}</td>
                  <td className="py-2 px-4">
                    {activeTab === 1 ? order.warehouseSource.warehouseName : <p className="text-green-700 font-bold"> Đã Cân Bằng </p>}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {activeTab === 1 ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelOrder(order.id);
                          }}
                          className="bg-red text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Hủy Phiếu
                        </button>
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2 hover:bg-blue-600 transition"
                        >
                          Chi Tiết
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-red">{order.reason || "Không có lý do"}</span>
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2 hover:bg-blue-600 transition"
                        >
                          i
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-lg">Không có đơn chuyển kho nào.</p>
        )}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-blue-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal hiển thị chi tiết */}
      {isModalOpen && selectedOrder && (
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

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderApprovalPage;
