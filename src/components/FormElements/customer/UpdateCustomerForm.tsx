import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import { Customer } from "@/types/customer"; 
import API_ROUTES from "@/utils/apiRoutes"; 
import axiosInstance from "@/utils/axiosInstance";

import CustomerSelectModal from "@/components/FormElements/order/CustomerSelectModal-byCustomer"; // Import modal mới

interface UpdateProps {
  onClose: () => void;
  setCustomers: (customers: Customer[]) => void;
  onSuccess: () => Promise<void>;
  customer: Customer; 
}

const Update: React.FC<UpdateProps> = ({
  onClose,
  setCustomers,
  onSuccess,
  customer,
}) => {
  const [formData, setFormData] = useState({
    id: customer.id,
    customerName: customer.customerName,
    phoneNumber: customer.phoneNumber,
    dateOfBirth: customer.dateOfBirth,
    address: customer.address,
    email: customer.email,
    note: customer.note,
  });

  const [isCustomerSelectModalVisible, setIsCustomerSelectModalVisible] = useState(false); // Modal chọn khách hàng
  const [selectedAddress, setSelectedAddress] = useState<string>(formData.address || ""); // Lưu địa chỉ đã chọn

  // Cập nhật lại formData khi customer thay đổi
  useEffect(() => {
    setFormData({
      id: customer.id,
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      dateOfBirth: customer.dateOfBirth,
      address: customer.address,
      email: customer.email,
      note: customer.note,
    });
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCustomerSelectModalVisible) {
      // Nếu modal đang hiển thị, không gửi form
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn cập nhật thông tin khách hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(
          `${API_ROUTES.CUSTOMERS}/${formData.id}`,
          formData
        );
        await onSuccess(); 
        onClose(); 

        Swal.fire("Thành công!", "Khách hàng đã được cập nhật.", "success");
      } catch (error) {
        console.error("Lỗi khi gửi biểu mẫu: ", error);
        Swal.fire(
          "Thất bại!",
          "Đã xảy ra lỗi khi cập nhật khách hàng.",
          "error"
        );
      }
    }
  };

  // Xử lý khi nhấn vào nút chỉnh sửa địa chỉ
  const handleAddressEditClick = () => {
    setIsCustomerSelectModalVisible(true); // Hiển thị modal chọn khách hàng
  };

  // Hàm chọn địa chỉ của khách hàng
  const handleSelectCustomerAddress = (customer: Customer, address: any) => {
    setFormData((prevData) => ({
      ...prevData,
      address: address.detailedAddress, // Cập nhật địa chỉ đã chọn
    }));
    setSelectedAddress(address.detailedAddress); // Cập nhật địa chỉ trong state
    setIsCustomerSelectModalVisible(false); // Đóng modal sau khi chọn địa chỉ
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên khách hàng
        </label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày sinh
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
          required
        />
      </div>

      {/* Địa chỉ */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <div>
          <span>{selectedAddress}</span>
          <button
            type="button"
            onClick={handleAddressEditClick}
            className="mt-2 text-sm text-blue-600"
          >
            Chỉnh sửa địa chỉ
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
        ></textarea>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cập nhật khách hàng
        </button>
      </div>

      {/* Modal chọn khách hàng */}
      <CustomerSelectModal
        isVisible={isCustomerSelectModalVisible}
        onClose={() => setIsCustomerSelectModalVisible(false)}
        onSelectCustomerAddress={handleSelectCustomerAddress}
      />
    </form>
  );
};

export default Update;
