"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from "@/utils/axiosInstance";
import { decrypt } from '@/utils/cryptoUtils'; // Nhập hàm giải mã
import Swal from "sweetalert2"; // Nhập thư viện SweetAlert2


const Checkout = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); // Thông tin khách hàng được chọn
  const [showModal, setShowModal] = useState(false); // Điều khiển modal

  // Kiểm tra thông tin khách hàng từ localStorage
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

  // Gọi API để lấy danh sách thông tin nhận hàng
  useEffect(() => {
    if (customerId) {
      axios.get(`http://localhost:8087/api/contact-info/customer/${customerId}`)
        .then((response) => {
          const contacts = response.data;
          setContactList(contacts);

          // Lấy thông tin địa chỉ mặc định (có status: 1)
          const defaultContact = contacts.find(contact => contact.status === 1);
          if (defaultContact) {
            setSelectedContact(defaultContact);
          }
        })
        .catch(error => console.error('Lỗi khi gọi API thông tin nhận hàng:', error));
    }
  }, [customerId]);

  // Lấy dữ liệu giỏ hàng từ cookie dựa trên ID khách hàng
  useEffect(() => {
    if (customerId) {
      const cartKey = `user_cart_${customerId}`;
      const cartData = Cookies.get(cartKey);

      if (cartData) {
        const parsedData = JSON.parse(cartData);
        setItems(parsedData);
      } else {
        router.push('/inventory/cart');
      }
    }
  }, [customerId]);

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Xử lý khi người dùng chọn địa chỉ từ modal
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(false); // Ẩn modal sau khi chọn
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedContact && items.length > 0) {
      // Tạo dữ liệu để gửi đi
      const data = {
        customer: customerId, // ID khách hàng
        price: totalAmount, // Tổng tiền
        employeeId: 1, // ID nhân viên (bạn có thể thay đổi giá trị này nếu cần)
        order_Details: items.map(item => ({
          product_Id: item.id, // ID sản phẩm
          purchasePrice: item.price, // Giá mua
          quantity: item.quantity, // Số lượng
        })),
        contact: JSON.stringify(selectedContact) // Chuyển đổi thông tin khách hàng thành chuỗi
      };

      // Xuất dữ liệu gửi đi ra màn hình console
      console.log('Dữ liệu gửi đi json:', JSON.stringify(data, null, 2));

      // Hiển thị xác nhận thanh toán
      const result = await Swal.fire({
        title: 'Xác nhận thanh toán',
        text: `Tổng tiền: ${totalAmount.toLocaleString()}đ. Bạn có chắc chắn muốn xác nhận?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
      });

      if (result.isConfirmed) {
        try {
          // Gọi API để xác nhận thanh toán
          const response = await axiosInstance.post('http://localhost:8888/v1/api/invoices', data);
          console.log('Đơn hàng đã được xác nhận:', response.data);

          // Hiển thị thông báo thành công
          await Swal.fire({
            title: 'Thành công!',
            text: 'Đơn hàng của bạn đã được xác nhận.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          // Xóa sản phẩm trong giỏ hàng
          const cartKey = `user_cart_${customerId}`;
          Cookies.remove(cartKey);
          setItems([]); // Xóa sản phẩm trong state

          // Chuyển đến trang cảm ơn
          router.push('/inventory/cart/checkout/thanks');

        } catch (error) {
          console.error('Lỗi khi xác nhận thanh toán:', error);
          // Hiển thị thông báo thất bại
          await Swal.fire({
            title: 'Lỗi!',
            text: 'Đã xảy ra lỗi khi xác nhận thanh toán. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    } else {
      console.error('Vui lòng chọn thông tin khách hàng và có sản phẩm trong giỏ hàng.');
      Swal.fire({
        title: 'Thông báo!',
        text: 'Vui lòng chọn thông tin khách hàng và có sản phẩm trong giỏ hàng.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-4">Thanh Toán</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tổng tiền:</h2>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-800">{totalAmount.toLocaleString()}đ</span>
          <div className="ml-2 p-2 bg-green-100 rounded-lg border border-green-300 shadow-md">
            <p className="text-gray-600">Tổng cộng</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="w-2/3 bg-white shadow-md rounded-lg p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Không có sản phẩm nào trong giỏ hàng!</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b py-2">
                <div className="flex items-center">
                  <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded" />
                  <div className="ml-2">
                    <h2 className="font-bold text-sm">{item.productName}</h2>
                    <p className="text-gray-600 text-sm">Giá: {item.price.toLocaleString()}đ</p>
                    <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Thành tiền: {(item.price * item.quantity).toLocaleString()}đ</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-1/3 bg-white shadow-md rounded-lg p-4 ml-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Thông tin thanh toán</h2>
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
    >
       khác
    </button>
  </div>

  {/* Form hiển thị thông tin khách hàng được chọn */}
  {selectedContact && (
    <div className="mb-4">
      <p><strong>Họ và tên:</strong> {selectedContact.recipientName}</p>
      <p><strong>Số điện thoại:</strong> {selectedContact.phoneNumber}</p>
      <p><strong>Địa chỉ:</strong> {`${selectedContact.detailedAddress}, ${selectedContact.ward}, ${selectedContact.district}, ${selectedContact.province}`}</p>
      {selectedContact.status === 1 && (
        <span className="text-red font-semibold text-sm">[Mặc định]</span>
      )}
    </div>
  )}

  <button
    onClick={handleSubmit}
    className="bg-green-800 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors duration-300"
  >
    Xác nhận thanh toán
  </button>
</div>

      </div>
      {/* Modal hiển thị danh sách địa chỉ */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-2/3 md:w-1/2 lg:w-1/3 relative"> {/* Giảm chiều rộng của modal */}
            <h2 className="text-lg font-bold mb-3 text-center text-gray-800">Chọn địa chỉ giao hàng</h2> {/* Kích thước chữ tiêu đề */}

            {/* Nút Đóng nằm phía trên cùng bên phải */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-red text-white px-2 py-1 rounded-full hover:bg-red transition-colors duration-200"
            >
              ×
            </button>

            <ul className="space-y-2 mb-4">
              {contactList.map(contact => (
                <li key={contact.id}>
                  <button
                    onClick={() => handleSelectContact(contact)}
                    className={`p-4 rounded-lg w-full text-left flex justify-between items-center 
                          transition-all duration-300 ease-in-out 
                          ${contact.status === 1 ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'} 
                          ${selectedContact?.id === contact.id ? 'bg-blue-100 border border-blue-300' : ''} 
                          hover:bg-gray-200 hover:shadow-md`}
                  >
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-700 text-sm">{contact.recipientName}</p> {/* Kích thước chữ */}
                      <p className="text-gray-600 text-sm">{contact.phoneNumber}</p> {/* Kích thước chữ */}
                      <p className="text-gray-500 text-xs">{`${contact.detailedAddress}, ${contact.ward}, ${contact.district}, ${contact.province}`}</p> {/* Kích thước chữ */}
                    </div>
                    {contact.status === 1 && (
                      <span className="text-red font-semibold text-xs">[Mặc định]</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 mr-2 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition-colors duration-300 w-1/3"
              >
                Cập nhật
              </button>

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-500 transition-colors duration-300 w-1/3"
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Checkout;
