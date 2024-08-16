// components/OrderInfo.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import axios from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes'; // Import API_ROUTES
import Modal from '@/components/Modal/Modal';
import FormAddSupplier from '@/components/FormElements/supplier/AddSupplierForm';
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';


interface OrderInfoProps {
  products: Product[];
  selectedSupplier: string; // Thêm prop này để nhận selectedSupplier từ component cha
  setSelectedSupplier: React.Dispatch<React.SetStateAction<string>>;
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
  selectedSupplier,
  setSelectedSupplier,
  setBatchName,
  setExpiryDate,
  setNote,
  setLocation,
  setEmployeeId,
  batchName,
  expiryDate,
  note,
  location,
  employeeId,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    initializeEmployeeFromLocalStorage();
  }, []);

  useEffect(() => {
    const total = products.reduce((acc, product) => acc + product.quantity * product.price, 0);
    setTotalPrice(total);
    setAmountDue(total); // Bạn có thể điều chỉnh tính toán cần trả nhà cung cấp dựa vào logic của bạn
  }, [products]);

  useEffect(() => {
    // Fetch suppliers from API
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get<Supplier[]>(API_ROUTES.SUPPLIERS);
        console.log('Fetched suppliers:', response.data); // Log data received from API
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);


  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await axios.get<Location[]>(API_ROUTES.LOCATIONS);
        console.log('Fetched locations:', response.data); // Log data received from API
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(Number(e.target.value));
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  const handleCloseModal = () => {
    setShowAddSupplierForm(false);
    
  };
  return (
    <div className="p-4 bg-gray-100 border rounded-md text-sm bg-blue-50">
      <div className="flex justify-between mb-4">
      {employee ? (<span className="font-bold text-red">{employee.employeeName}</span>) : (
          <p>No employee data available</p>
        )}
        <span>{new Date().toLocaleString()}</span>
      </div>
      <div className="space-y-4 ">
        <div className="flex justify-between">
          <label className='font-bold'>Phiếu nhập</label>
          <input type="text" value="Mã phiếu tự động" disabled className=" p-1 border border-green-500 w-36 text-center text-blue-500 font-bold" />
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tên lô hàng:</label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="p-1 border-b border-gray-300 w-36"
          />
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Hạn sử dụng:</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="p-1 border-b border-gray-300 w-36"
          />
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Vị trí kho:</label>
          <div>
            <button className="px-2 pb-2 text-white bg-blue-500 rounded-md">
              +
            </button>

            <select
              value={location.toString()}
              onChange={handleLocationChange}
              className="pb-2 border-b border-gray-300 w-36 ml-2"
            >
              <option value="">Chọn vị trí kho</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id.toString()}>
                  {location.warehouseLocation}
                </option>
              ))}
            </select>
          </div>
          {/* Modal thêm nhà cung cấp */}
          <Modal isVisible={showAddSupplierForm} onClose={handleCloseModal} title="THÊM NHÀ CUNG CẤP">
            <FormAddSupplier />
          </Modal>
          
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Cung cấp:</label>
         
          <div>
            <button className="px-2 pb-2 text-white bg-blue-500 rounded-md" 
             onClick={() => setShowAddSupplierForm(true)}>
              +
            </button>
            <select
              value={selectedSupplier}
              onChange={handleSupplierChange}
              className="pb-2 border-b border-gray-300 w-36 ml-2"
            >
              <option value="">Nhà cung cấp</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id.toString()}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>
         
          
         
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Trạng thái</label>
          <span className='text-blue-500'>Phiếu tạm</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tổng tiền hàng</label>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Cần trả nhà cung cấp</label>
          <span className='font-bold text-red'>{formatCurrency(amountDue)}</span>
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
