import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import Swal from "sweetalert2";
import {Warehouse} from "@/types/warehouse";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUserTag,
} from "react-icons/fa";
import Switcher from "@/components/Switchers/SwitcherThree";
import { useEmployeeStore } from "@/stores/employeeStore";


const FormAddEmployee: React.FC = () => {
  const getCurrentDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { employee } = useEmployeeStore();

  const [formData, setFormData] = useState({
    employeeName: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
    dateJoined: getCurrentDateString(),
    email: "",
    address: "",
    position: "",
    status: 1,
    basicSalary: 0,
    accountId: false,
    warehouseId: employee?.warehouseId || "", // Gán mặc định nếu không có gì từ employee
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // State chứa danh sách kho
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  // Gọi API để lấy danh sách kho khi employee là "admin"
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoadingWarehouses(true);
        const response = await axiosInstance.get(
          "http://localhost:8888/v1/api/warehouses",
        );
        setWarehouses(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kho:", error);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    if (employee?.position === "admin") {
      fetchWarehouses();
    }
  }, [employee?.position]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, accountId: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn không thể hoàn tác thay đổi này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, xác nhận!",
      cancelButtonText: "Hủy",
    });

    if (confirmResult.isConfirmed) {
      try {
        const payload = {
          ...formData,
          position: employee?.position.toLowerCase().includes("admin")?"Quản lý":"Nhân viên",
          warehouseId: formData.warehouseId || employee?.warehouseId, // Nếu không chọn kho mới thì giữ lại warehouseId cũ
        };

        // Gửi yêu cầu tạo mới nhân viên
        await axiosInstance.post(API_ROUTES.EMPLOYEES, payload);

        Swal.fire({
          title: "Thành công!",
          text: "Dữ liệu đã được tạo mới.",
          icon: "success",
        }).then(() => {
          window.location.reload(); // Tải lại trang sau khi tạo mới
        });
      } catch (error) {
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi gửi dữ liệu.",
          icon: "error",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaUser /> Tên nhân viên
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaUserTag /> Giới tính
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaPhone /> Số điện thoại
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaCalendarAlt /> Ngày sinh
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaCalendarAlt /> Ngày vào làm
          </label>
          <input
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaEnvelope /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaMapMarkerAlt /> Địa chỉ
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaUserTag /> Chức vụ
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          >
            {employee?.position.toLowerCase().includes("quản lý") &&
              formData.position !== "Nhân viên" && (
                <option value="Nhân viên">Nhân viên</option>
              )}

            {employee?.position.toLowerCase().includes("admin") &&
              formData.position !== "Quản lý" && (
                <option value="Quản lý">Quản lý</option>
              )}

            {!employee?.position.toLowerCase().includes("quản lý") &&
              !employee?.position.toLowerCase().includes("admin") && (
                <option value="">Chọn vị trí</option>
              )}
          </select>
        </div>

        <div>
          <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
            <FaDollarSign /> Lương cơ bản
          </label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Hiển thị trường select kho hàng nếu là admin */}
        {employee?.position === "admin" && !loadingWarehouses && (
          <div>
            <label className="text-gray-700 block flex items-center gap-2 text-sm font-medium">
              Chọn kho hàng
            </label>
            <select
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              className="border-gray-300 mt-2 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Chọn kho hàng</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.warehouseName} - {warehouse.location}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Hiển thị switcher để tạo tài khoản hệ thống */}
        <div className="mt-6 flex items-center space-x-2">
          <span className="text-gray-700 text-sm font-medium">
            Tạo tài khoản hệ thống
          </span>
          <Switcher
            isChecked={formData.accountId}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Thêm mới
        </button>
      </div>
    </form>
  );
};

export default FormAddEmployee;
