"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import Swal from "sweetalert2";
import WorkShift from '@/components/FormElements/WorkShift/WorkScheduleForm'; // 
import Modal from '@/components/Modal/Modal_WorkShift'; // Nhập component Modal
interface Employee {
  id: number;
  employeeName: string;
}

interface WorkShift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  status: number;
}

const EmployeeWorkScheduleForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<{ value: number; label: string } | null>(null);
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [showWork, setShowWork] = useState(false); // State cho form thêm mới


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.EMPLOYEES);
        const data: Employee[] = response.data.map((employee: any) => ({
          id: employee.id,
          employeeName: employee.employeeName,
        }));
        setEmployees(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      }
    };

    const fetchWorkShifts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.WORK_SHIFTS);
        const data: WorkShift[] = response.data.map((shift: any) => ({
          id: shift.id,
          shiftName: shift.shiftName,
          startTime: shift.startTime,
          endTime: shift.endTime,
          status: shift.status,
        }));
        setWorkShifts(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ca làm việc:", error);
      }
    };

    fetchEmployees();
    fetchWorkShifts();
  }, []);

  const handleEmployeeChange = (selectedOption: { value: number; label: string } | null) => {
    setSelectedEmployee(selectedOption);
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shiftId = Number(e.target.value);
    setSelectedShifts((prevSelectedShifts) =>
      prevSelectedShifts.includes(shiftId)
        ? prevSelectedShifts.filter((id) => id !== shiftId)
        : [...prevSelectedShifts, shiftId]
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee || selectedShifts.length === 0 || !startDate) {
      Swal.fire({
        icon: "error",
        title: "Thông tin chưa đầy đủ",
        text: "Vui lòng điền đầy đủ thông tin trước khi tạo lịch làm việc.",
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có muốn tạo lịch làm việc cho nhân viên này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, tạo lịch!",
      cancelButtonText: "Hủy",
    });

    if (confirmation.isConfirmed) {
      const payload = {
        employeeId: selectedEmployee.value,
        workShiftId: selectedShifts,
        workDate: startDate,
      };

      try {
        console.log("Data post: ", payload)
        const response = await axiosInstance.post(
          API_ROUTES.ATTENDANCES,
          payload
        );
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã tạo lịch làm việc cho nhân viên thành công!",
        });

        // Reset form sau khi gửi
        setSelectedEmployee(null);
        setSelectedShifts([]);
        setStartDate("");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tạo lịch làm việc.",
        });
      }
    }
  };

  const employeeOptions = employees.map(employee => ({
    value: employee.id,
    label: employee.employeeName,
  }));

  const shiftOptions = workShifts.map(shift => ({
    value: shift.id,
    label: `${shift.shiftName} (${shift.startTime} - ${shift.endTime})`,
  }));
  const openWorkScheduleForm = () => { // Hàm mở form thêm mới
    setShowWork(true);
  };

  const closeWorkScheduleForm = async () => {
    setShowWork(false);
     // Load lại dữ liệu khi đóng modal
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800">
        Tạo Lịch Làm Việc Cho Nhân Viên
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="employee"
            className="block text-base font-semibold text-blue-800 mb-2"
          >
            Chọn Nhân Viên
          </label>
          <Select
            id="employee"
            options={employeeOptions}
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            placeholder="Tìm kiếm nhân viên..."
            className="basic-single text-black"
            classNamePrefix="select"
          />
        </div>

        <div className="mb-5">
          <div className="mb-5 flex items-center ">
            <label className="block text-base font-semibold text-blue-800">
              Chọn Lịch Làm Việc
            </label>
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded ml-2"
              onClick={openWorkScheduleForm} // Mở modal thêm mới khi bấm nút
            >
              +
            </button>
          </div>
          <Modal isVisible={showWork} onClose={closeWorkScheduleForm} title="THÊM MỚI CA LÀM VIỆC">
        <WorkShift  />
      </Modal>
          <div className="flex flex-wrap">
            {shiftOptions.map((shift) => (
              <label
                key={shift.value}
                className="mr-4 mb-2 flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={shift.value}
                  checked={selectedShifts.includes(shift.value)}
                  onChange={handleShiftChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{shift.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="startDate"
            className="block text-base font-semibold text-blue-800 mb-2"
          >
            Ngày Bắt Đầu Làm
          </label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Tạo Lịch
          </button>
        </div>
       
      </form>
     
    </div>
    
  );
};

export default EmployeeWorkScheduleForm;
