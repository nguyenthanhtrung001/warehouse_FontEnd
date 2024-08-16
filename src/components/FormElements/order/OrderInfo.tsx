"use client"
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Product } from '@/types/product';
import Modal from '@/components/Modal/Modal';
import FormAddCustomer from '@/components/FormElements/customer/AddCustomerForm';
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';




interface OrderInfoProps {
  products: Product[];
  selectedCustomer: string; // Thay đổi prop này từ selectedSupplier thành selectedCustomer
  setSelectedCustomer: React.Dispatch<React.SetStateAction<string>>;
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

interface Customer {
  id: number;
  customerName: string;
}
interface Location {
  id: number;
  warehouseLocation: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  products,
  selectedCustomer,
  setSelectedCustomer,
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash'); // Thêm state cho hình thức thanh toán
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
    // Fetch customers from API
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.CUSTOMERS); // Sử dụng axiosInstance
        const data = response.data;
        console.log('Fetched customers:', data); // Log data received from API
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error('Customers data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);



const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const handleCloseModal = () => {
    setShowAddCustomerForm(false);
  };

  const handleSuccess = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.CUSTOMERS);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching updated customers: ", error);
    }
  };
  const handleCustomerChange = (selectedOption: any) => {
    setSelectedCustomer(selectedOption ? selectedOption.value : '');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(Number(e.target.value));
  };
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
   
    <div className="p-4 bg-blue-50 border rounded-md text-sm text-black">
       <Modal isVisible={showAddCustomerForm} onClose={handleCloseModal} title="Thêm khách hàng">
        <FormAddCustomer onClose={handleCloseModal} setCustomers={setCustomers} onSuccess={handleSuccess} />
      </Modal>
      <div className="flex justify-between mb-4">
         {employee ? (<span className="font-bold text-red">{employee.employeeName}</span>) : (
          <p>No employee data available</p>
        )}
        <span>{new Date().toLocaleString()}</span>
      </div>
      <div className="space-y-4 text-black">
        <div className="flex justify-between">
          <label className='font-bold'>Đơn hàng</label>
          <input type="text" value="Mã đơn tự động" disabled className="p-1 border border-green-500 w-36 text-center text-blue-500 font-bold" />
        </div>
       
        <div className="flex justify-between">
          <label className='font-bold mt-2'>Khách hàng:</label>
          <button className="px-2 text-white bg-blue-500 rounded-md"  onClick={() => setShowAddCustomerForm(true)}>
              +
            </button>
          <div className="w-38">
            <Select
              options={customers.map((customer) => ({
                value: customer.id.toString(),
                label: customer.customerName,
              }))}
              onChange={handleCustomerChange}
              className="w-38"
              placeholder="Tìm khách hàng..."
            />
          </div>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Trạng thái:</label>
          <span className='text-blue-500'>Đơn tạm</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Hình thức thanh toán:</label>
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="pb-2 border-b border-gray-300 w-36 ml-2 text-center"
          >
            <option value="cash">Tiền mặt</option>
            <option value="transfer">Chuyển khoản</option>
          </select>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Tổng tiền hàng:</label>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <label className='font-bold'>Số tiền cần thu:</label>
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
