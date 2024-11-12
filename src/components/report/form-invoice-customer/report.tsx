"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { useSearchParams, useRouter } from 'next/navigation';
import { decrypt } from '@/utils/cryptoUtils';

const ReportPage = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const encryptedId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    if (encryptedId) {
      const decryptedId = decrypt(decodeURIComponent(encryptedId));
      setOrderId(decryptedId);
    }
  }, [encryptedId]);

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
        {orderId && (
          <PDFViewer width="100%" height="100%">
            <MyDocument orderId={orderId} customerName={''} customerAddress={''} />
          </PDFViewer>
        )}
      </div>
      
    </div>
  );
};

export default ReportPage;
