"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/axiosInstance";
import dayjs from "dayjs";

const CreatePayrollForm: React.FC = () => {
  const [duePeriod] = useState("Hàng tháng");
  const [workingPeriod, setWorkingPeriod] = useState<string>(`${dayjs().startOf('month').format('D/M/YYYY')} - ${dayjs().endOf('month').format('D/M/YYYY')}`);
  const [scope, setScope] = useState("Tất cả nhân viên");
  const [message, setMessage] = useState<string | null>(null);

  const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScope(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      duePeriod,
      workingPeriod,
      scope,
    };

    const result = await Swal.fire({
      title: 'Xác nhận',
      text: "Bạn có chắc chắn muốn tạo bảng lương này không?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        // Gửi dữ liệu lên server bằng axios
        const response = await axiosInstance.post("http://localhost:8888/v1/api/payrolls/create-all", payload);

        Swal.fire({
          title: "Thành công!",
          text: "Đã tạo bảng lương thành công",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          setMessage("Đã tạo bảng lương thành công");
          setWorkingPeriod(`${dayjs().startOf('month').format('D/M/YYYY')} - ${dayjs().endOf('month').format('D/M/YYYY')}`);
          setScope("Tất cả nhân viên");
        });
      } catch (error) {
        Swal.fire({
          title: "Thất bại!",
          text: "Lỗi: Không thể tạo bảng lương",
          icon: "error",
          confirmButtonText: "OK"
        });
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg">
      {/* <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800">
        Tạo Bảng Tính Lương
      </h2> */}
      <form onSubmit={handleSubmit}>
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("thành công")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex flex-wrap -mx-3 mb-5">
          <div className="w-full px-3">
            <label
              htmlFor="duePeriod"
              className="block text-base font-semibold text-blue-800 mb-2"
            >
              Kỳ hạn trả lương
            </label>
            <input
              type="text"
              name="duePeriod"
              value={duePeriod}
              readOnly
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-5">
          <div className="w-full px-3">
            <label
              htmlFor="workingPeriod"
              className="block text-base font-semibold text-blue-800 mb-2"
            >
              Kỳ làm việc
            </label>
            <input
              type="text"
              name="workingPeriod"
              value={workingPeriod}
              readOnly
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>
        </div>
        <div className="mb-5">
          <span className="block text-base font-semibold text-blue-800 mb-2">Phạm vi áp dụng</span>
          <div className="flex items-center mt-2">
            <input
              id="all-employees"
              name="scope"
              type="radio"
              value="Tất cả nhân viên"
              checked={scope === "Tất cả nhân viên"}
              onChange={handleScopeChange}
              className="h-4 w-4 text-blue-600 border-blue-300 focus:ring-blue-500"
            />
            <label htmlFor="all-employees" className="ml-2 text-base font-medium text-blue-900">
              Tất cả nhân viên
            </label>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Tạo Bảng Lương
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePayrollForm;
