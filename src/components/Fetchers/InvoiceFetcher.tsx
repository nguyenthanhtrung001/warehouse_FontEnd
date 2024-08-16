import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  onInvoicesFetched: (invoices: any[]) => void;
}

const InvoiceFetcher: React.FC<Props> = ({ onInvoicesFetched }) => {
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`http://localhost:8087/api/invoices`);
        const data = await response.json();
        onInvoicesFetched(data);
      } catch (error) {
        console.error('Lỗi khi lấy hóa đơn:', error);
      }
    };

    fetchInvoices();
  }, [onInvoicesFetched]);

  return null; // Component này không cần render gì
};

export default InvoiceFetcher;
