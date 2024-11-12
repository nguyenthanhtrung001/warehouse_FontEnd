"use client";

import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import SupplierSelect from '../SupplierSelect';
import axiosInstance from '@/utils/axiosInstance';
import { useEmployeeStore } from '@/stores/employeeStore';

const ReportPage = () => {
  const [idSupplier, setIdSupplier] = useState<number | null>(1);
  const [nameSupplier, setNameSupplier] = useState<string>('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchSupplierName = async (id: number) => {
      try {
        const response = await axiosInstance.get<{ supplierName: string }>(`http://localhost:8888/v1/api/suppliers/${id}`);
        setNameSupplier(response.data.supplierName);
      } catch (error) {
        console.error('Error fetching supplier name:', error);
      }
    };

    if (idSupplier !== null) {
      fetchSupplierName(idSupplier);
    }
  }, [idSupplier]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black ">
      {/* Row for Supplier, Month, and Year selection */}
      <div className="flex flex-row justify-between w-full max-w-lg items-center">
        
        {/* Select Supplier on the left */}
        <div className="flex-grow mr-4">
          <SupplierSelect onSelect={setIdSupplier} />
        </div>
        
        {/* Month and Year on the right */}
        <div className="flex flex-row space-x-4">
          {/* Select Month */}
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700">Tháng</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>
          
          {/* Select Year */}
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700">Năm</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min="2000"
              max="2100"
            />
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {idSupplier !== null && (
        <PDFViewer width="100%" height="100%" className="mt-4">
          <MyDocument idSupplier={idSupplier} nameSupplier={nameSupplier} employee={employee} month={month} year={year} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ReportPage;
