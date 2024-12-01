"use client";
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import CustomerSelectModal from './CustomerSelectModal';
import { useEmployeeStore } from '@/stores/employeeStore';

interface OrderInfoProps {
  products: Product[];
  selectedCustomer: any;
  selectedAddress: any;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  note: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  products,
  selectedCustomer,
  selectedAddress,
  setNote,
  note,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const total = products.reduce((acc, product) => acc + product.quantity * product.price, 0);
    setTotalPrice(total);
  }, [products]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="p-4 bg-blue-50 border rounded-md text-sm text-black">
      <CustomerSelectModal
        isVisible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelectCustomerAddress={(customer, address) => {
          selectedCustomer.current = customer;
          selectedAddress.current = address;
        }}
      />

      <div className="flex justify-between mb-4">
        {employee ? (
          <span className="font-bold text-red">{employee.employeeName}</span>
        ) : (
          <p>No employee data available</p>
        )}
        <span>{new Date().toLocaleString()}</span>
      </div>

      <div className="space-y-4 text-black">
        <div className="flex justify-between">
          <label className="font-bold">Đơn hàng</label>
          <input type="text" value="Mã đơn tự động" disabled className="p-1 border border-green-500 w-36 text-center text-blue-500 font-bold" />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-bold mt-2">Khách hàng:</label>
          <button className="px-2 text-white bg-blue-500 rounded-md" onClick={() => setShowCustomerModal(true)}>
            Chọn khách hàng
          </button>
        </div>

        {selectedCustomer.current && selectedAddress.current && (
          <div className="p-2 border rounded-md bg-white mt-4">
            <h3 className="font-bold">Thông tin nhận hàng:</h3>
            <p><strong>Tên khách hàng:</strong> {selectedCustomer.current.customerName}</p>
            <p><strong>SĐT:</strong> {selectedAddress.current.phoneNumber}</p>
            <p><strong>Địa chỉ:</strong>{selectedAddress.current.detailedAddress} -{selectedAddress.current.ward} - {selectedAddress.current.district} - {selectedAddress.current.province}  </p>
            <p><strong>Email:</strong> {selectedCustomer.current.email}</p>
          </div>
        )}

        <div className="flex justify-between">
          <label className="font-bold">Tổng tiền hàng:</label>
          <span>{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <label className="font-bold">Ghi chú</label>
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
