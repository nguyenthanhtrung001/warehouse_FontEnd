"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaWarehouse } from "react-icons/fa";
import axios from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEmployeeStore } from "@/stores/employeeStore";
import { Location } from "@/types/Location";

// Định nghĩa kiểu cho sản phẩm
interface ProductDetail {
  id: number;
  nameProduct: string;
  quantity: number;
  bath: {
    batchName: string;
    expiryDate: string;
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

const ITEMS_PER_PAGE = 10;

const OrderApprovalPage = () => {
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(
    null,
  );
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1); // Tab trạng thái
  const { employee } = useEmployeeStore();
  const [globalValue, setGlobalValue] = useState<number>(0);

  // Gọi API để lấy danh sách đơn chuyển kho
  const fetchOrders = () => {
    if (!employee || !employee.warehouseId) return;
    axios
      .get(
        `http://localhost:8888/v1/api/deliveryNotes/import-transfer?warehouseId=${employee?.warehouseId}`,
      )
      .then((response) => {
        const sortedOrders = response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id,
        ); // Sắp xếp theo id giảm dần
        setOrders(sortedOrders);
      })
      .catch((error) => {
        console.error("Error fetching transfer orders:", error);
        Swal.fire(
          "Error",
          "Có lỗi xảy ra khi lấy danh sách đơn chuyển kho.",
          "error",
        );
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [employee]);

  // Lọc đơn chuyển kho theo trạng thái
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Tính toán số trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Hàm định dạng ngày giờ theo định dạng dd/MM/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  // Hàm lấy chi tiết sản phẩm cho một đơn hàng cụ thể
  const fetchOrderDetails = (orderId: number) => {
    axios
      .get(`http://localhost:8888/v1/api/deliveryNotes/${orderId}/details`)
      .then((response) => {
        setProductDetails(response.data);
        setGlobalValue(
          response.data.reduce(
            (total: any, product: { quantity: any }) =>
              total + product.quantity,
            0,
          ),
        );
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi lấy chi tiết đơn hàng.", "error");
      });
  };

  // Hàm lấy vị trí lưu trữ
  const fetchLocations = async () => {
    try {
      if (!employee || !employee.warehouseId) return;
      const response = await axios.get<Location[]>(
        `http://localhost:8888/v1/api/locations/warehouse/${employee?.warehouseId}`,
      );
      console.log("Fetched locations:", response.data); // Log data received from API
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Hàm xử lý chấp nhận đơn
  const acceptOrder = () => {
    if (!selectedLocation) {
      Swal.fire(
        "Xác nhận",
        "Vui lòng chọn vị trí lưu trữ trước khi chấp nhận.",
        "warning",
      );
      return;
    }

    if (selectedOrder) {
      // Chuẩn bị payload dựa trên thông tin đơn chuyển hiện tại
      const payload = {
        employeeId: employee?.id, // Thay thế ID nhân viên phù hợp
        import_Export_Details: productDetails.map((detail) => ({
          product_Id: detail.productId,
          quantity: detail.quantity,
        })),
        location: selectedLocation,
        deliveryNote: selectedOrder.id,
        warehouseId: selectedOrder.warehouseSource.id, // ID kho nguồn từ đơn chuyển
        warehouseDestination: selectedOrder.warehouseDestination?.id || null, // ID kho đích từ đơn chuyển
        expiryDate: new Date().toISOString(), // Ví dụ: lấy ngày hiện tại làm expiryDate
      };
      console.log("data: ", JSON.stringify(payload, null, 2));
      // Gửi POST API
      axios
        .post("http://localhost:8888/v1/api/receipts/transfer", payload)
        .then((response) => {
          Swal.fire(
            "Thành công",
            "Đơn chuyển kho đã được chấp nhận và dữ liệu đã được gửi.",
            "success",
          );
          // Cập nhật danh sách đơn chuyển kho
          fetchOrders();
          const updatedOrders = orders.filter(
            (order) => order.id !== selectedOrder.id,
          );
          setOrders(updatedOrders);
          setSelectedOrder(null);
        })
        .catch((error) => {
          // Kiểm tra phản hồi lỗi từ API
          if (error.response && error.response.data) {
            const { message } = error.response.data; // Lấy thông báo lỗi từ JSON
            Swal.fire({
              icon: "error",
              title: "Có lỗi xảy ra khi nhập hàng!",
              text: message || "Vui lòng thử lại.", // Hiển thị chi tiết lỗi
              confirmButtonText: "OK",
            });
          } else {
            // Trường hợp lỗi không có phản hồi từ API
            console.error("Lỗi chuyển kho:", error);
            Swal.fire({
              icon: "error",
              title: "Có lỗi xảy ra khi chuyển hàng!",
              text: "Vui lòng thử lại.",
              confirmButtonText: "OK",
            });
          }
        });
    }
  };

  // Hàm xử lý từ chối đơn
  const rejectOrder = () => {
    if (!selectedOrder) return;

    axios
      .post(
        ` http://localhost:8888/v1/api/deliveryNotes/cancel-transfer/${selectedOrder.id}`,
        { reason: rejectionReason },
      )
      .then(() => {
        Swal.fire("Success", "Đơn đã bị từ chối.", "success");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: 2 } : order,
          ),
        );
        setShowRejectModal(false);
        setSelectedOrder(null);
      })
      .catch((error) => {
        console.error("Error rejecting order:", error);
        Swal.fire("Error", "Có lỗi xảy ra khi từ chối đơn.", "error");
      });
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-8 text-black shadow-lg">
      <h1 className="mb-6 text-center text-4xl font-bold text-blue-600">
        DANH SÁCH ĐƠN CHUYỂN KHO
      </h1>

      {/* Tabs */}
      <div className="mb-6 flex justify-center space-x-4">
        <button
          className={`rounded-lg px-4 py-2 font-semibold ${activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          onClick={() => {
            setActiveTab(1);
            setCurrentPage(1);
          }}
        >
          Chờ Xử Lý
        </button>
        <button
          className={`rounded-lg px-4 py-2 font-semibold ${activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
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
          <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">
                  STT
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">
                  Mã Chuyển Kho
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">
                  Từ
                </th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">
                  Đến
                </th>
                <th className="px-4 py-3 text-center font-semibold text-blue-700">
                  Ngày Chuyển
                </th>
                <th className="px-4 py-3 text-center font-semibold text-blue-700"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-b transition-colors hover:bg-blue-50"
                  onClick={() => {
                    setSelectedOrder(order);
                    fetchOrderDetails(order.id);
                    fetchLocations();
                  }}
                >
                  <td className="px-4 py-2">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-4 py-2">CK-{order.id}</td>
                  <td className="px-4 py-2">
                    {order.warehouseSource.warehouseName}
                  </td>
                  <td className="px-4 py-2">
                    {order.warehouseDestination?.warehouseName || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatDate(order.deliveryDate)}
                  </td>
                  {activeTab === 2 ? (
                    <span className="font-bold text-green-700">
                      {" "}
                      Đã nhập kho
                    </span>
                  ) : (
                    <p className="font-bold text-green-700"> </p>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            Không có đơn chuyển kho nào.
          </p>
        )}
      </div>

      {/* Phân trang */}
      <div className="mb-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`rounded-md px-3 py-1 ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-200"}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal chi tiết đơn chuyển kho */}
      {selectedOrder && (
        <div className="bg-gray-900 fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-gray-800 mb-4 text-2xl font-semibold">
              Chi Tiết Đơn Chuyển Kho #{selectedOrder.id}
            </h2>

            {/* Bảng chi tiết sản phẩm */}
            <table className="min-w-full overflow-hidden rounded-lg bg-blue-50 shadow-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-700">
                    Số Lượng
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-700">
                    Lô Hàng
                  </th>
                </tr>
              </thead>
              <tbody>
                {productDetails.map((detail) => (
                  <tr
                    key={detail.id}
                    className="border-b transition-colors hover:bg-blue-100"
                  >
                    <td className="px-4 py-2">{detail.nameProduct}</td>
                    <td className="px-4 py-2 text-center">{detail.quantity}</td>
                    <td className="px-4 py-2 text-center">
                      {detail.bath.batchName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Chọn vị trí lưu trữ */}
            {activeTab === 1 && (
              <div className="mt-4">
                <label className="text-gray-700 mb-2 block font-semibold">
                  Chọn Vị Trí Lưu Trữ:
                </label>
                <select
                  className="mt-2 w-full rounded-md border p-2"
                  value={selectedLocation || ""}
                  onChange={(e) => setSelectedLocation(Number(e.target.value))}
                >
                  <option value="">Chọn vị trí lưu trữ</option>
                  {locations
                    .sort(
                      (a, b) =>
                        (b.capacity ?? 0) -
                        (b.currentLoad ?? 0) - // Sắp xếp theo dung lượng còn lại
                        ((a.capacity ?? 0) - (a.currentLoad ?? 0)),
                    )
                    .map((location) => {
                      const remainingCapacity =
                        (location.capacity ?? 0) - (location.currentLoad ?? 0);
                      const isDisabled = remainingCapacity < globalValue; // Kiểm tra nếu kho không hợp lệ
                      const statusColor = isDisabled
                        ? "red"
                        : location.status === "MAINTENANCE"
                          ? "orange"
                          : "green";

                      return (
                        <option
                          key={location.id}
                          value={location.id}
                          disabled={
                            isDisabled || location.status === "MAINTENANCE"
                          }
                          style={{
                            color: statusColor,
                          }}
                        >
                          {location.warehouseLocation} - Dung lượng:{" "}
                          {location.capacity ?? 0} (Còn lại: {remainingCapacity}
                          ) -{" "}
                          {isDisabled
                            ? "Hết chỗ"
                            : location.status === "MAINTENANCE"
                              ? "Bảo trì"
                              : "Sẵn sàng"}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

            {/* Nút hành động */}
            <div className="mt-4 flex justify-end space-x-4">
              {activeTab === 1 && (
                <>
                  <button
                    onClick={acceptOrder}
                    className="rounded-lg bg-green-500 px-5 py-2 text-white shadow-md transition-colors hover:bg-green-600"
                  >
                    <FaCheck className="mr-2" /> Xác Nhận
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="hover:bg-red-600 rounded-lg bg-red px-5 py-2 text-white shadow-md transition-colors"
                  >
                    <FaTimes className="mr-2" /> Từ Chối
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="hover:bg-gray-600 rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="bg-gray-900 fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Nhập Lý Do Từ Chối</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mb-4 w-full rounded-lg border border-blue-300 p-3"
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={rejectOrder}
                className="hover:bg-red-600 rounded-lg bg-red px-4 py-2 text-white transition-colors"
              >
                Xác Nhận Từ Chối
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-500 hover:bg-gray-600 rounded-lg px-4 py-2 text-white transition-colors"
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
