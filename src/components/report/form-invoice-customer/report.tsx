"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { useSearchParams, useRouter } from 'next/navigation';
import { decrypt } from '@/utils/cryptoUtils';
import axios from 'axios';

const ReportPage = () => {
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const encryptedId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    const fetchInvoiceData = async (decryptedId: string) => {
      try {
        const response = await axios.get(`http://localhost:8888/v1/api/invoices/${decryptedId}`);
        setInvoiceData(response.data);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    if (encryptedId) {
      const decryptedId = decrypt(decodeURIComponent(encryptedId));
      fetchInvoiceData(decryptedId);
    }
  }, [encryptedId]);

  // Hàm định dạng ngày từ ISO thành dd/MM/yyyy
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBack = () => {
    router.push(`/order`);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-4 bg-red w-36 h-10 mb-2">
        <button
          onClick={handleBack}
          className="px-4 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>
      <div className="flex-grow flex justify-center items-center">
        {invoiceData && (
          <PDFViewer width="100%" height="100%">
            <MyDocument
              orderId={invoiceData.id.toString()}
              customerName={invoiceData.contactInfo.split(" - ")[0]}
              customerAddress={invoiceData.contactInfo.split(" - ")[2]}
              totalAmount={invoiceData.price}
              printDate={formatDate(invoiceData.printDate)}
              employeeId={invoiceData.employeeId} // Truyền thêm employeeId
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
