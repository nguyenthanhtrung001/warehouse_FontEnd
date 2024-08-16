"use client"; // Đánh dấu component này là Client Component

import { useSearchParams } from 'next/navigation'; // Sử dụng useSearchParams từ next/navigation
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from '@/components/FormElements/Receipt-update/ProductTableReceipt';
import OrderInfo from '@/components/FormElements/Receipt-update/OrderInfo';
import { Product } from '@/types/product';
import ActionButtons from '@/components/FormElements/Receipt-update/ActionButtons'; // Nhập ActionButtons nếu có

const UpdateReceipt = () => {
  const searchParams = useSearchParams(); // Lấy các tham số truy vấn từ URL
  const id = searchParams.get('id'); // Lấy giá trị của tham số truy vấn 'id'

  const [receipt, setReceipt] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);

  useEffect(() => {
    if (id) {
      const fetchReceipt = async () => {
        try {
          const response = await axios.get(`http://localhost:8088/api/receipt-details/${id}/details`);
          const data = response.data;
          console.log('Fetched Data:', JSON.stringify(data, null, 2)); // Xuất dữ liệu dưới dạng JSON
          
          if (data.length > 0) {
            const lastDetail = data[0].receipt;
            const firstDetail = data[0];
            setReceipt(firstDetail);
            setProducts(data.map((detail: any) => ({
              id: detail.productId,
              productName: detail.nameProduct,
              quantity: detail.quantity,
              price: detail.purchasePrice,
              code: `MH000${detail.productId}`
            })));
            setSelectedSupplier(lastDetail.supplier.id.toString());
            setBatchName(firstDetail.bath.batchName); // Nếu batchName là batchDetail_Id
            const date = new Date(firstDetail.bath.expiryDate);
            setExpiryDate(date.toISOString().split('T')[0]); // Chỉ lấy phần ngày tháng
            setNote(firstDetail.bath.note);
            setLocation(1); // Sửa đổi nếu có thông tin location
            setEmployeeId(firstDetail.employeeId);
          }
        } catch (error) {
          console.error('Error fetching receipt:', error);
        }
      };

      fetchReceipt();
    }
  }, [id]);

  const handleSave = async () => {
    // Thực hiện hành động lưu hoặc cập nhật phiếu nhập
  };

  return (
    <div className="flex w-full h-screen p-4 text-xs text-black">
      <div className="flex-2 w-2/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">CẬP NHẬT NHẬP HÀNG</h1>
        </div>
        {receipt ? (
          <>
            <ProductTable
              products={products}
              setProducts={setProducts}
            />
          </>
        ) : (
          <p>Đang tải dữ liệu phiếu nhập...</p>
        )}
      </div>
      <div className="flex-1 w-1/3 p-4 border-l">
        {receipt ? (
          <>
            <OrderInfo
              products={products} 
              selectedSupplier={selectedSupplier} 
              setSelectedSupplier={setSelectedSupplier} 
              setBatchName={setBatchName} 
              setExpiryDate={setExpiryDate} 
              setNote={setNote} 
              setLocation={setLocation} 
              setEmployeeId={setEmployeeId} 
              batchName={batchName} 
              expiryDate={expiryDate} 
              note={note} 
              location={location} 
              employeeId={employeeId} 
            />
            <div className='mt-4'>
              <ActionButtons handleComplete={handleSave} />
            </div>
          </>
        ) : (
          <p>Đang tải thông tin đơn hàng...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateReceipt;
