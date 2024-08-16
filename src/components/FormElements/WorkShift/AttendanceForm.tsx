"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from 'sweetalert2';

interface AttendanceFormProps {
  id?: number;
  onClose: () => void;
}

interface WorkShift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  status: number;
}

interface Employee {
  id: number;
  employeeName: string;
}

interface AttendanceData {
  id: number;
  workShift: WorkShift;
  employee: Employee;
  workDate: string;
  status: number;
  startTime: string;
  endTime: string;
  lateTime: number;
  earlyTime: number;
  note: string | null;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ id, onClose }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [isFullTime, setIsFullTime] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (id === undefined) return; // Không làm gì nếu id không được cung cấp

    axiosInstance
      .get<AttendanceData>(`http://localhost:8888/v1/api/attendances/${id}`)
      .then((response) => {
        const data = response.data;
        setAttendanceData(data);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setNote(data.note || "");
        setIsFullTime(data.startTime === data.workShift.startTime && data.endTime === data.workShift.endTime);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu chấm công:", error);
      });
  }, [id]); // Thêm id vào mảng phụ thuộc

  if (!attendanceData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const handleFullTimeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsFullTime(checked);
    if (checked) {
      setStartTime(attendanceData.workShift.startTime);
      setEndTime(attendanceData.workShift.endTime);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedAttendanceData = {
      id: attendanceData.id,
      startTime,
      endTime,
      note,
    };
    
    axiosInstance
      .put(`http://localhost:8888/v1/api/attendances/${attendanceData.id}`, updatedAttendanceData)
      .then((response) => {
        Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật.', 'success');
        onClose();
      })
      .catch((error) => {
        Swal.fire('Lỗi!', 'Không thể cập nhật dữ liệu.', 'error');
        console.error("Lỗi khi cập nhật dữ liệu:", error);
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800">
        Bảng Chấm Công {id && <p>ID: {id}</p>}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-base font-semibold text-blue-800 mb-2">
            Tên Nhân Viên
          </label>
          <p className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white">
            {attendanceData.employee.employeeName}
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-base font-semibold text-blue-800 mb-2">
            Ngày Chấm Công
          </label>
          <p className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white">
            {attendanceData.workDate}
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-base font-semibold text-blue-800 mb-2">
            Ca Làm Việc
          </label>
          <p className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white">
            {attendanceData.workShift.shiftName}
          </p>
        </div>

        <div className="mb-5">
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={isFullTime}
              onChange={handleFullTimeToggle}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-base font-semibold text-blue-800">
              Đúng giờ
            </span>
          </label>

          {!isFullTime && (
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-base font-semibold text-blue-800 mb-2">
                  Giờ Bắt Đầu
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-base font-semibold text-blue-800 mb-2">
                  Giờ Ra Về
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-base font-semibold text-blue-800 mb-2">
            Ghi Chú
          </label>
          <textarea
            value={note}
            onChange={handleNoteChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm bg-white"
            rows={3}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Chấm Công
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;
