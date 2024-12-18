// components/OrderInfo.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';
import CurrentTime from '@/utils/currentTime';

interface OrderInfoProps {
  products: Product[];
  
  setBatchName: React.Dispatch<React.SetStateAction<string>>;
  setExpiryDate: React.Dispatch<React.SetStateAction<string>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<number>>;
  setEmployeeId: React.Dispatch<React.SetStateAction<number>>;
  batchName: string;
  expiryDate: string;
  note: string;
  location: number;
  employeeId: number;
}

interface Supplier {
  id: number;
  supplierName: string;
}
interface Location {
  id: number;
  warehouseLocation: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  products,
  
  setBatchName,
  setExpiryDate,
  setNote,
  setEmployeeId,
  batchName,
  expiryDate,
  note,
  employeeId,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  
  const [locations, setLocations] = useState<Location[]>([]);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    initializeEmployeeFromLocalStorage();
  }, []);

  useEffect(() => {
    const total = products.reduce((acc, product) => acc + product.quantity, 0);
    setTotalPrice(total);
    setAmountDue(total); // Bạn có thể điều chỉnh tính toán cần trả nhà cung cấp dựa vào logic của bạn
  }, [products]);

  

  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8086/api/locations');
        const data = await response.json();
        console.log('Fetched locations:', data); // Log data received from API
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error('Locations data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []); 


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  return (
    <div className="p-4 bg-gray-100 border rounded-md text-sm">
      <div className="flex justify-between mb-4">
      {employee ? (<span className="font-bold text-red">{employee.employeeName}</span>) : (
          <p>No employee data available</p>
        )}
        <CurrentTime />
      </div>
      <div className="space-y-4 ">
        <div className="flex justify-between">
          <label className='font-bold'>Phiếu hủy</label>
          <input type="text" value="Mã phiếu tự động" disabled className=" p-1 border border-green-500 w-36 text-center text-blue-500 font-bold" />
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Trạng thái:</label>
          <span className='text-blue-500'>Phiếu tạm</span>
        </div>
      
        <div className="flex justify-between">
          <label className='font-bold'>Tổng mặt hàng hủy:</label>
          <span className='font-bold text-red'>{amountDue}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Ghi chú</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="p-2 border-b border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
