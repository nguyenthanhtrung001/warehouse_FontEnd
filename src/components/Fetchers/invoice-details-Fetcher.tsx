import React, { useEffect } from 'react';
import axios from 'axios';

interface Props {
  invoiceId: string;
  onReceiptFetched: (data: any) => void;
}

const Fetcher: React.FC<Props> = ({ invoiceId, onReceiptFetched }) => {
  useEffect(() => {
    const fetchReceiptById = async () => {
      try {
        const response = await axios.get(`http://localhost:8087/api/invoice-details/invoice/${invoiceId}`);
        const data = response.data;
        onReceiptFetched(data);
      } catch (error) {
        console.error('Error fetching receipt:', error);
      }
    };

    if (invoiceId) {
      fetchReceiptById();
    }
  }, [invoiceId, onReceiptFetched]);

  return null; // Component này không cần render gì
};

export default Fetcher;
