// pages/report.tsx
"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import SupplierSelect from '../SupplierSelect';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance

const ReportPage = () => {
  const [idSupplier, setIdSupplier] = useState<number | null>(1);
  const [nameSupplier, setNameSupplier] = useState<string>('');

  useEffect(() => {
    const fetchSupplierName = async (id: number) => {
      try {
        const response = await axiosInstance.get<{ supplierName: string }>(`http://localhost:8888/v1/api/suppliers/${id}`);
        setNameSupplier(response.data.supplierName);
        console.log("nameL: ",nameSupplier);
      } catch (error) {
        console.error('Error fetching supplier name:', error);
      }
    };

    if (idSupplier !== null) {
      fetchSupplierName(idSupplier);
    }
  }, [idSupplier, nameSupplier]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black text p-4">
      <SupplierSelect onSelect={setIdSupplier} />
      {idSupplier !== null && (
        <PDFViewer width="100%" height="100%">
          <MyDocument idSupplier={idSupplier} nameSupplier={nameSupplier} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ReportPage;
