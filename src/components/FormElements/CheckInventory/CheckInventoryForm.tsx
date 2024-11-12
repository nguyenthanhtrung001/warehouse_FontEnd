"use client"; // Đánh dấu component này là Client Component

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ProductTable from '@/components/FormElements/CheckInventory/ProductTableCheck';
import OrderInfo from '@/components/FormElements/CheckInventory/OrderInfoCheck';
import ActionButtons from '@/components/FormElements/CheckInventory/ActionButtons';
import { Product } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_ROUTES from '@/utils/apiRoutes';
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useEmployeeStore } from '@/stores/employeeStore';



const InventoryCheck: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [receiptID, setReceipt] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS);
        const data: any[] = response.data;
        setAllReceipts(data);
      } catch (error) {
        console.error('Lỗi khi lấy product:', error);
      }
    };

    fetchProducts();
  }, []);

  const fetchInventory = async (productId: string) => {

    const productIdNumber = Number(productId);
    if (!employee || !employee.warehouseId) return;
    
    try {
      const response = await axiosInstance.get(`${API_ROUTES.API_BATCH_DETAILS_SPECIFIC_PRODUCT(productIdNumber,employee?.warehouseId)}`);
      const data = response.data;
      console.log('Fetched Data:', JSON.stringify(data, null, 2)); // Xuất dữ liệu dưới dạng JSON

      if (data.length > 0) {
        const firstDetail = data[0]; // Chọn chi tiết đầu tiên
        const receipt = firstDetail.receiptId;

        // Cập nhật các giá trị trạng thái từ dữ liệu trả về
        setReceipt(firstDetail);
        setProducts(data.map((detail: any) => ({
          id: detail.id,
          productName: detail.batch.batchName,
          quantityReturn: detail.quantity,
          quantity: detail.quantity,
          price: detail.batch.expiryDate,
          code: `MH000${detail.productId}`
        })));

        setReceipt(firstDetail.receipt.id);
        const date = new Date(firstDetail.bath.expiryDate);
        setExpiryDate(date.toISOString().split('T')[0]); // Chỉ lấy phần ngày tháng
        setBatchName(firstDetail.bath.batchName);

        setNote(firstDetail.bath.note || '');
        setEmployeeId(receipt.employeeId);
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInventory(id);
    }
  }, [id]);

  const handleSearchChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedReceipt = selectedOption.value;
      setProducts([]); // Xóa toàn bộ bảng
      fetchInventory(selectedReceipt.id.toString()); // Lấy chi tiết phiếu nhập mới
    }
  };

  const handleComplete = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận gửi phiếu nhập?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        // Lọc các sản phẩm có số lượng lớn hơn 0
        const receiptDetails = products
          .filter((product) => product.quantity - product.quantityReturn !== 0)
          .map((product) => ({
            batchDetail: product.id,
            actualQuantity: product.quantity,
            inventory: product.quantityReturn,
            
          }));

        const data = {
          employeeId:employee?.id,
          inventoryCheckDetails: receiptDetails,
          notes: note,
          warehouseId: employee?.warehouseId,
        };

        if (receiptDetails.length === 0) {
          toast.error('Không có sản phẩm với số lượng hợp lệ để gửi!');
          return;
        }

        console.log('Dữ liệu gửi đi:', JSON.stringify(data));

        const response = await axiosInstance.post(API_ROUTES.INVENTORY_CHECK_SLIPS, data);

        if (response.status === 200 || response.status === 201) {
          console.log('Phiếu nhập được gửi thành công');
          // Hiển thị thông báo thành công bằng Swal
          Swal.fire({
            title: 'Thành công!',
            text: 'Phiếu nhập được gửi thành công!',
            icon: 'success',
          });

          // Xóa dữ liệu của bảng và thông tin phiếu nhập
          setProducts([]);
          setExpiryDate('');
          setNote('');
          setBatchName('');
          setEmployeeId(0);
        } else {
          console.error('Gửi phiếu nhập thất bại:', response.statusText);
          toast.error('Gửi phiếu nhập thất bại!');
        }
      } catch (error) {
        console.error('Lỗi khi gửi phiếu nhập:', error);
        toast.error('Lỗi khi gửi phiếu nhập!');
      }
    }
  };

  return (
    <div className="flex w-full h-screen p-4 text-xs text-black">
      <ToastContainer />
      <div className="flex-2 w-2/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-black">KIỂM KHO </h1>
         
          
          <div className="flex items-center space-x-2">
            <Select
              options={allReceipts.map((receipt) => ({
                value: receipt,
                label: `MH000${receipt.id} - ${receipt.productName}`,
              }))}
              onChange={handleSearchChange}
              className="w-80"
              placeholder="Tìm kiếm mặt hàng..."
            />
          </div>
        </div>

        <ProductTable products={products} setProducts={setProducts} />
      </div>
      <div className="flex-1 w-1/3 p-4 border-l">
        <OrderInfo
          products={products}
          setExpiryDate={setExpiryDate}
          setNote={setNote}
          setLocation={setLocation}
          setEmployeeId={setEmployeeId}
          setBatchName={setBatchName}
          batchName={batchName}
          expiryDate={expiryDate}
          note={note}
          location={location}
          employeeId={employeeId}
        />
        <div className='mt-4'>
          <ActionButtons handleComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

export default InventoryCheck;
