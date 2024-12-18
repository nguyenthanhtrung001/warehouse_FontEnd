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
  const [totalIncre, setTotalIncre] = useState(0);
  const [totalDecre, setTotalDecre] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const { employee } = useEmployeeStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    initializeEmployeeFromLocalStorage();
  }, []);

  useEffect(() => {
    const result = products.reduce(
      (acc, product) => {
        const difference = product.quantity - product.quantityReturn;
    
        if (difference !== 0) {
          acc.countNonZeroDifferences += 1;
        }
        if (difference > 0) {
          acc.totalQuantityIncre += difference;
        } else if (difference < 0) {
          acc.totalQuantityDecre += difference;
        }
    
        return acc;
      },
      { totalQuantityDecre: 0, totalQuantityIncre: 0, countNonZeroDifferences: 0 }
    );
    
    const total = result.totalQuantityDecre + result.totalQuantityIncre;
    
    setCount(result.countNonZeroDifferences);
    setTotalDecre(result.totalQuantityDecre);
    setTotalIncre(result.totalQuantityIncre);
    setAmountDue(total);
    
    // Bạn có thể điều chỉnh tính toán cần trả nhà cung cấp dựa vào logic của bạn
  }, [products]);

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
          <label className='font-bold'>Phiếu kiểm</label>
          <input type="text" value="Mã phiếu tự động" disabled className=" p-1 border border-green-500 w-36 text-center text-blue-500 font-bold" />
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Trạng thái:</label>
          <span className='text-blue-500'>Phiếu tạm</span>
        </div>
      
        <div className="flex justify-between">
          <label className='font-bold'>Tổng lô hàng kiểm tra:</label>
          <span className='font-bold'>{count}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tổng lệch tăng:</label>
          <span className='font-bold text-green-800'>{totalIncre}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tổng lệch giảm:</label>
          <span className='font-bold text-red'> {totalDecre}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tổng chênh lệch:</label>
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
