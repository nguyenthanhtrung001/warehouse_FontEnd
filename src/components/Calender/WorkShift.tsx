"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import moment from 'moment';
import AttendanceForm from '@/components/FormElements/WorkShift/AttendanceForm'; // Nhập AttendanceForm
import Modal from '@/components/Modal/Modal_WorkShift'; // Nhập component Modal
import ModalWorkShift from '@/components/Modal/Modal'; // Nhập component Modal
import EmployeeWorkScheduleForm from "@/components/FormElements/WorkShift/EmployeeWorkScheduleForm";
const localizer = momentLocalizer(moment);

interface WorkShift {
  shiftName: string;
  startTime: string;
  endTime: string;
}

interface Employee {
  employeeName: string;
}

interface Attendance {
  id: number;
  workDate: string;
  workShift: WorkShift;
  employee: Employee;
  status: number;
  statusText?: string;
}

const EmployeeCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Attendance | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showWorkScheduleForm, setShowWorkScheduleForm] = useState(false); // State cho form thêm mới


  const fetchAttendances = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.ATTENDANCES}/current-month`);
      const data: Attendance[] = response.data;

      const formattedEvents = data.map((attendance) => {
        const startDate = new Date(`${attendance.workDate}T${attendance.workShift.startTime}`);
        const endDate = new Date(`${attendance.workDate}T${attendance.workShift.endTime}`);

        if (startDate > endDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn('Invalid date for attendance:', attendance);
          return null;
        }

        return {
          id: attendance.id,
          title: `${attendance.employee.employeeName || 'Tên nhân viên không có'} - ${attendance.workShift.shiftName || 'Ca làm việc không có'}`,
          start: startDate,
          end: endDate,
          employee: attendance.employee,
          workShift: attendance.workShift,
          workDate: attendance.workDate,
          status: attendance.status,
          statusText: attendance.status === 1 ? 'Chưa chấm công' : 'Đã chấm công',
        };
      }).filter(event => event !== null);

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const openAttendanceForm = () => {
    setShowAttendanceForm(true);
    setModalIsOpen(false);
  };

  const closeAttendanceForm = async () => {
    setShowAttendanceForm(false);
    await fetchAttendances(); // Load lại dữ liệu khi đóng modal
  };
  const openWorkScheduleForm = () => { // Hàm mở form thêm mới
    setShowWorkScheduleForm(true);
  };

  const closeWorkScheduleForm = async () => {
    setShowWorkScheduleForm(false);
    await fetchAttendances(); // Load lại dữ liệu khi đóng modal
  };

  return (
    <div className="p-4">
      
      <div className="grid grid-cols-12">
          <div className="col-span-9">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
            LỊCH LÀM VIỆC NHÂN VIÊN
            </h4>
          </div>
          <div className="col-span-3 px-2 font-bold">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={openWorkScheduleForm} // Mở modal thêm mới khi bấm nút
          >
            Thêm mới
          </button>
            {/* <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button> */}
          </div>
        </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        onSelectEvent={handleEventClick}
        views={{ week: true, day: true, month: true }}
        defaultView={Views.WEEK}
        eventPropGetter={(event) => {
            const backgroundColor = event.status === 1 ? '#1da1f2' : '#2d760a'; // Màu nhạt hơn
         
          return {
            style: {
              backgroundColor: backgroundColor,
              color: 'white',
            },
          };
        }}
      />

      {/* Modal Hiển Thị Thông Tin Chi Tiết */}
      <Modal isVisible={modalIsOpen} onClose={closeModal} title="CHI TIẾT CA LÀM VIỆC">
        {selectedEvent && (
          <div className='px-15'>
            <p><strong>Tên Nhân Viên:</strong> {selectedEvent.employee?.employeeName || 'Thông tin không có'}</p>
            <p><strong>Ngày Làm Việc:</strong> {format(new Date(selectedEvent.workDate), 'dd/MM/yyyy')}</p>
            <p><strong>Ca Làm:</strong> {selectedEvent.workShift?.shiftName || 'Thông tin không có'}</p>
            <p><strong>Giờ Bắt Đầu:</strong> {format(new Date(`1970-01-01T${selectedEvent.workShift?.startTime || '00:00'}`), 'HH:mm')}</p>
            <p><strong>Giờ Kết Thúc:</strong> {format(new Date(`1970-01-01T${selectedEvent.workShift?.endTime || '00:00'}`), 'HH:mm')}</p>
            <p><strong>Trạng Thái:</strong> {selectedEvent.statusText}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={closeModal} className="px-4 py-2 bg-red text-white rounded">Đóng</button>
              {selectedEvent.status === 1 && (
                <button onClick={openAttendanceForm} className="px-4 py-2 bg-blue-500 text-white rounded">Chấm công</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Chấm Công */}
      <Modal isVisible={showAttendanceForm} onClose={closeAttendanceForm} title="CHẤM CÔNG">
        {selectedEvent && <AttendanceForm id={selectedEvent.id} onClose={closeAttendanceForm} />}
      </Modal>
       {/* Modal Thêm Mới Ca Làm Việc */}
       <ModalWorkShift isVisible={showWorkScheduleForm} onClose={closeWorkScheduleForm} title="THÊM MỚI ">
        <EmployeeWorkScheduleForm  />
      </ModalWorkShift>
    </div>
  );
};

export default EmployeeCalendar;
