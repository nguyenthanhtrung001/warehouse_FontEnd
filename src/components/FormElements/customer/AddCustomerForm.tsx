"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import API_ROUTES from "@/utils/apiRoutes"; // Import API routes từ cấu hình
import axiosInstance from "@/utils/axiosInstance";

interface AddCustomerFormProps {
  onClose: () => void;
  setCustomers: (customers: any[]) => void; // Thay đổi kiểu theo cách bạn lưu trữ danh sách khách hàng
  onSuccess: () => Promise<void>; // Thêm thuộc tính này
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onClose,
  setCustomers,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    email: "",
    note: "",
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn thêm khách hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          ...formData,
          id: parseInt(formData.id, 10), // Chuyển đổi id về số khi gửi lên API
        };
        await axiosInstance.post(API_ROUTES.CUSTOMERS, payload);

        // Cập nhật danh sách khách hàng và gọi onSuccess
        await onSuccess(); // Gọi hàm onSuccess sau khi thành công

        onClose(); // Đóng modal sau khi thành công

        Swal.fire("Thành công!", "Khách hàng đã được thêm.", "success");
      } catch (error) {
        console.error("Error submitting form: ", error);
        Swal.fire("Thất bại!", "Đã xảy ra lỗi khi thêm khách hàng.", "error");
      }
    }
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
        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
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
      {showAdditionalInfo && (
        <>
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
        </>
      )}
      <div className="mt-4 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setShowAdditionalInfo((prev) => !prev)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAdditionalInfo ? "Ẩn thông tin" : "Thêm thông tin"}
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm khách hàng
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
