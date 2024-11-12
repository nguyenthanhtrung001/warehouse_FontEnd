"use client";
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaHourglassHalf, FaTruck, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import { decrypt } from '@/utils/cryptoUtils';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderDetails, setOpenOrderDetails] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer));
        setCustomerId(decryptedCustomer.id);
      } catch (error) {
        console.error('Failed to decrypt customer data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (customerId) {
      axios.get(`http://localhost:8888/v1/api/invoices/customer/${customerId}`)
        .then(response => {
          const sortedOrders = response.data.sort((a, b) => new Date(b.printDate) - new Date(a.printDate));
          setOrders(sortedOrders);
        })
        .catch(error => {
          console.error('Failed to fetch order history:', error);
        });
    }
  }, [customerId]);

  const fetchOrderDetails = (invoiceId) => {
    if (openOrderDetails === invoiceId) {
      setOpenOrderDetails(null);
      return;
    }

    axios.get(`http://localhost:8888/v1/api/invoice-details/invoice/${invoiceId}`)
      .then(response => {
        const updatedOrders = orders.map(order => {
          if (order.id === invoiceId) {
            return { ...order, items: response.data };
          }
          return order;
        });
        setOrders(updatedOrders);
        setOpenOrderDetails(invoiceId);
      })
      .catch(error => {
        console.error('Failed to fetch order details:', error);
      });
  };

  const handleReturn = (invoiceId) => {
    // Xử lý logic trả hàng ở đây
    console.log(`Requesting return for invoice ID: ${invoiceId}`);
    // Có thể gọi API để xử lý trả hàng ở đây
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: // Đã đặt
        return <FaClipboardList className="text-blue-600 text-2xl" />;
      case 2: // Đang vận chuyển
        return <FaTruck className="text-yellow-500 text-2xl" />;
      case 3: // Thanh toán
        return <FaHourglassHalf className="text-orange-600 text-2xl" />;
      case 4: // Thành công
        return <FaCheckCircle className="text-green-600 text-2xl" />;
      default:
        return <FaClipboardList className="text-gray-600 text-2xl" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center my-8 text-gray-800">Lịch Sử Đơn Hàng</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào!</p>
        ) : (
          <>
            {/* Thanh trạng thái tổng quan */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Trạng thái đơn hàng</h2>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  {getStatusIcon(1)}
                  <span className={`ml-2 ${orders.some(order => order.status >= 1) ? 'text-blue-600' : 'text-gray-400'}`}>Đã đặt</span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(2)}
                  <span className={`ml-2 ${orders.some(order => order.status >= 2) ? 'text-yellow-500' : 'text-gray-400'}`}>Đang vận chuyển</span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(3)}
                  <span className={`ml-2 ${orders.some(order => order.status >= 3) ? 'text-orange-600' : 'text-gray-400'}`}>Thanh toán</span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(4)}
                  <span className={`ml-2 ${orders.some(order => order.status >= 4) ? 'text-green-600' : 'text-gray-400'}`}>Thành công</span>
                </div>
              </div>
            </div>

            {currentOrders.map((order) => (
              <div key={order.id} className="border-b py-3 transition-colors hover:bg-gray-100 px-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium">Mã đơn hàng: <span className="font-bold text-green-700">{order.id}</span></p>
                    <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.printDate).toLocaleDateString()}</p>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)} {/* Thêm biểu tượng tương ứng với trạng thái */}
                      <p className={`text-sm ml-2 ${order.status === 1 ? 'text-blue-600' :
                        order.status === 2 ? 'text-yellow-500' :
                          order.status === 3 ? 'text-orange-600' :
                            order.status === 4 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                        Trạng thái: {order.status === 1 ? 'Đã đặt' :
                          order.status === 2 ? 'Đang vận chuyển' :
                            order.status === 3 ? 'Thanh toán' :
                              order.status === 4 ? 'Thành công' : 'Không xác định'}
                      </p>
                    </div>

                    <p className="text-base font-medium text-gray-900">Tổng tiền: {order.price.toLocaleString()}đ</p>
                  </div>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-500 transition-all duration-300"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    {openOrderDetails === order.id ? 'Đóng chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>

                {openOrderDetails === order.id && order.items && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mt-4">Sản phẩm trong đơn hàng:</h3>
                    <ul className="list-none pl-0 space-y-4 mt-4">
                      {order.items.map((item, index) => (
                        <li key={index} className="border rounded-lg p-4 flex justify-between items-center shadow">
                          <div>
                            <p className="text-base font-medium text-gray-900">{item.nameProduct}</p>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          </div>
                          <p className="text-base font-medium text-green-700">{item.purchasePrice.toLocaleString()}đ</p>
                        </li>
                      ))}
                    </ul>
                    {/* Nút trả hàng nếu trạng thái là 4 */}
                    {order.status === 4 && (
                      <div className="flex justify-end mt-4">
                        <button
                          className="bg-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-500 transition-all duration-300"
                          onClick={() => handleReturn(order.id)}
                        >
                          Trả hàng
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-2 mx-1 rounded-md font-medium text-sm ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
