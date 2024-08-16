// pages/report.tsx
"use client";

import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocumentImEX';
import MonthYearSelector from '@/components/report/MonthYearSelector';

const ReportPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // tháng hiện tại
  const [year, setYear] = useState(new Date().getFullYear());   // năm hiện tại

  return (
    <div className="flex flex-col gap-12">
      <MonthYearSelector
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />
      <div className="flex justify-center items-center h-screen">
        <PDFViewer width="100%" height="100%">
          <MyDocument month={month} year={year} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ReportPage;
