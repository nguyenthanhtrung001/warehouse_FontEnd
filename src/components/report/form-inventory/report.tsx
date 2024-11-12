// pages/report.tsx
"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { useEmployeeStore } from '@/stores/employeeStore';

// Trang chính để hiển thị PDF
const ReportPage = () => {
  const { employee } = useEmployeeStore(); // Lấy thông tin nhân viên

  // Kiểm tra xem thông tin nhân viên có tồn tại hay không
  if (!employee) {
    return <div>Không có thông tin nhân viên.</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <PDFViewer width="100%" height="100%">
        {/* Truyền employee cho MyDocument */}
        <MyDocument employee={employee} />
      </PDFViewer>
    </div>
  );
};

export default ReportPage;
