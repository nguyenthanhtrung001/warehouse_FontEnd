"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import API_ROUTES from "@/utils/apiRoutes"; // Giả sử bạn có API_ROUTES chứa các route
import axiosInstance from "@/utils/axiosInstance"; // Giả sử bạn có axiosInstance chứa cấu hình axios

interface AddCustomerFormProps {
  onClose: () => void;
  setCustomers: (customers: any[]) => void;
  onSuccess: () => Promise<void>;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onClose,
  setCustomers,
  onSuccess,
}) => {
  // State cho form
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    email: "",
    note: "",
    province: { id: "", name: "" }, // Cập nhật kiểu đối tượng với id và name
    district: { id: "", name: "" }, // Cập nhật kiểu đối tượng với id và name
    ward: { id: "", name: "" }, // Cập nhật kiểu đối tượng với id và name
    detailedAddress: "",
  });

  // States cho các dropdown
  const [provinces, setProvinces] = useState<any[]>([]); // Danh sách tỉnh
  const [districts, setDistricts] = useState<any[]>([]); // Danh sách huyện
  const [wards, setWards] = useState<any[]>([]); // Danh sách xã

  // State điều khiển việc hiển thị các thông tin bổ sung (email, ngày sinh)
  const [showExtraFields, setShowExtraFields] = useState(false);

  const handleSelectChange = (
    field: "province" | "district" | "ward",
    value: string,
    name: string,
  ) => {
    setFormData({
      ...formData,
      [field]: {
        id: value, // Lưu ID
        name: name, // Lưu tên
      },
    });
  };

  // Fetch danh sách tỉnh khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://vapi.vnappmob.com/api/province/",
        );

        setProvinces(response.data.results || []); // Lưu danh sách tỉnh
      } catch (error) {
        console.error("Error fetching provinces:", error);
        Swal.fire("Lỗi", "Không thể kết nối với API tỉnh", "error");
      }
    };
    fetchProvinces();
  }, []);

  // Fetch danh sách huyện khi tỉnh thay đổi
  useEffect(() => {
    if (formData.province.id) {
      console.log("data tinh: ", formData.province);
      axios
        .get(
          `https://vapi.vnappmob.com/api/province/district/${formData.province.id}`,
        )
        .then((response) => {
          setDistricts(response.data.results || []); // Cập nhật danh sách huyện
        })
        .catch(() =>
          Swal.fire("Lỗi", "Không thể kết nối với API huyện", "error"),
        );
    }
  }, [formData.province.id]);

  // Fetch danh sách xã khi huyện thay đổi
  useEffect(() => {
    if (formData.district.id) {
      axios
        .get(`https://vapi.vnappmob.com/api/province/ward/${formData.district.id}`)
        .then((response) => {
          setWards(response.data.results || []); // Cập nhật danh sách xã
        })
        .catch(() => Swal.fire("Lỗi", "Không thể kết nối với API xã", "error"));
    }
  }, [formData.district.id]);

  // Hàm xử lý sự kiện thay đổi giá trị form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường cần thiết đã được điền chưa
    if (
      !formData.customerName ||
      !formData.phoneNumber ||
      !formData.province ||
      !formData.district ||
      !formData.ward
    ) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    // Xác nhận trước khi thêm khách hàng
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
        // Tạo payload gửi API
        const payload = {
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          address: `${formData.province}, ${formData.district}, ${formData.ward}, ${formData.detailedAddress}`,
          email: formData.email,
          note: formData.note,
              province: formData.province.name, // Sử dụng name
              district: formData.district.name, // Sử dụng name
              ward: formData.ward.name, // Sử dụng name
              detailedAddress: formData.detailedAddress,
        };

        console.log("data post: ", JSON.stringify(payload, null, 2));
        // Gửi request thêm khách hàng
        await axiosInstance.post(API_ROUTES.CUSTOMERS, payload);

        // Cập nhật dữ liệu sau khi thêm thành công
        await onSuccess();
        onClose();
        Swal.fire("Thành công!", "Khách hàng đã được thêm.", "success");
      } catch (error) {
        console.error("Error submitting form: ", error);
        Swal.fire("Thất bại!", "Đã xảy ra lỗi khi thêm khách hàng.", "error");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div className="grid grid-cols-2 gap-4">
          {/* Tên khách hàng */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Tên khách hàng
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tỉnh */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Tỉnh/Thành phố
            </label>
            <select
              name="province"
              value={formData.province.id}
              onChange={(e) =>
                handleSelectChange(
                  "province",
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text,
                )
              }
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Quận/Huyện
            </label>
            <select
              name="district"
              value={formData.district.id} // Sử dụng id
              onChange={(e) =>
                handleSelectChange(
                  "district",
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text,
                )
              }
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phường/Xã */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Phường/Xã
            </label>
            <select
              name="ward"
              value={formData.ward.id} // Sử dụng id
              onChange={(e) =>
                handleSelectChange(
                  "ward",
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text,
                )
              }
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </option>
              ))}
            </select>
          </div>

          {/* Địa chỉ chi tiết */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              name="detailedAddress"
              value={formData.detailedAddress}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Ghi chú */}
          <div>
            <label className="text-gray-700 block text-sm font-medium">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
            ></textarea>
          </div>
        </div>

        {/* Checkbox để hiển thị các thông tin bổ sung */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showExtraFields"
            checked={showExtraFields}
            onChange={() => setShowExtraFields(!showExtraFields)}
            className="mr-2"
          />
          <label htmlFor="showExtraFields" className="text-gray-700 text-sm">
            Hiển thị thông tin bổ sung (Email, Ngày sinh)
          </label>
        </div>

        {/* Hiển thị thêm các thông tin bổ sung */}
        {showExtraFields && (
          <div className="grid grid-cols-2 gap-4">
            {/* Ngày sinh */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-gray-300 mt-1 block w-full border-b-2 focus:border-indigo-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Thêm khách hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerForm;
