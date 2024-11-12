// pages/report.tsx
"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';


// Trang chính để hiển thị PDF
const ReportPage = () => (
  <div className="flex justify-center items-center h-screen">
    <PDFViewer width="100%" height="100%">
      <MyDocument />
    </PDFViewer>
  </div>
);

export default ReportPage;
