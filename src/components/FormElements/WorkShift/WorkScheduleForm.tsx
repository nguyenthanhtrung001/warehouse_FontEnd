"use client"
import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";

interface WorkSchedule {
  shiftName: string;
  workDate: string;
  startTime: string;
  endTime: string;
}

const WorkScheduleForm: React.FC = () => {
  const [schedule, setSchedule] = useState<WorkSchedule>({
    shiftName: "",
    workDate: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo dữ liệu JSON để gửi đến API
    const payload = {
      shiftName: schedule.shiftName,
      startTime: `${schedule.startTime}:00`, // Định dạng lại thành giờ phút giây
      endTime: `${schedule.endTime}:00`, // Định dạng lại thành giờ phút giây
      status: 1, // Giả định trạng thái là 1
    };

    // Xác nhận trước khi gửi
    const result = await Swal.fire({
      title: 'Xác nhận',
      text: "Bạn có chắc chắn muốn thêm lịch làm việc này không?",
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
        const response = await axiosInstance.post("http://localhost:8888/v1/api/workshifts", payload);

        // Nếu thành công, thông báo và reset form
        Swal.fire({
          title: "Thành công!",
          text: "Đã thêm lịch làm việc thành công",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          setMessage("Đã thêm lịch làm việc thành công");
          setSchedule({
            shiftName: "",
            workDate: "",
            startTime: "",
            endTime: "",
          });
        });
      } catch (error) {
        Swal.fire({
          title: "Thất bại!",
          text: "Lỗi: Không thể thêm lịch làm việc",
          icon: "error",
          confirmButtonText: "OK"
        });
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800">
        Thêm Lịch Làm Việc
      </h2>
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
          <div className="w-full px-3 mb-5 md:mb-0">
            <label
              htmlFor="shiftName"
              className="block text-base font-semibold text-blue-800 mb-2"
            >
              Tên ca làm
            </label>
            <input
              type="text"
              name="shiftName"
              value={schedule.shiftName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-5">
          <div className="w-full md:w-1/2 px-3 mb-5 md:mb-0">
            <label
              htmlFor="startTime"
              className="block text-base font-semibold text-blue-800 mb-2"
            >
              Giờ Bắt Đầu
            </label>
            <input
              type="time"
              name="startTime"
              value={schedule.startTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="endTime"
              className="block text-base font-semibold text-blue-800 mb-2"
            >
              Giờ Kết Thúc
            </label>
            <input
              type="time"
              name="endTime"
              value={schedule.endTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Thêm Lịch
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkScheduleForm;
