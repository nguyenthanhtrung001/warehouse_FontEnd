"use client"; // Đánh dấu component này là Client Component

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ProductTable from '@/components/FormElements/ReturnReceipt/ProductTableReturnReceipt';
import OrderInfo from '@/components/FormElements/ReturnReceipt/OrderInfoReturn';
import ActionButtons from '@/components/FormElements/ReturnReceipt/ActionButtons';
import { Product } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2'; // Import SweetAlert2
import API_ROUTES from '@/utils/apiRoutes';
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';

const UpdateReceipt: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [receiptID, setReceipt] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const { employee } = useEmployeeStore();


  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.RECEIPTS_FOR_RETURN);
        const data: any[] = response.data;
        setAllReceipts(data);
      } catch (error) {
        console.error('Lỗi khi lấy phiếu nhập:', error);
      }
    };

    fetchReceipts();
  }, []);

  const fetchReceiptById = async (receiptId: string) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.RECEIPT_DETAILS_CRE_RETURN(Number(receiptId)));
      const data = response.data;
      console.log('Fetched Data:', JSON.stringify(data, null, 2)); // Xuất dữ liệu dưới dạng JSON

      if (data.length > 0) {
        const firstDetail = data[0]; // Chọn chi tiết đầu tiên
        const receipt = firstDetail.receiptId;

        // Cập nhật các giá trị trạng thái từ dữ liệu trả về
        setReceipt(firstDetail);
        setProducts(data.map((detail: any) => ({
          id: detail.productId,
          idBath: detail.batchDetail_Id,
          productName: detail.nameProduct,
          quantityReturn: detail.quantity,
          price: detail.purchasePrice,
          code: `MH000${detail.productId}`
        })));
        setSelectedSupplier(firstDetail.receipt.supplier.supplierName.toString());
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
      fetchReceiptById(id);
    }
  }, [id]);

  const handleSearchChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedReceipt = selectedOption.value;
      setProducts([]); // Xóa toàn bộ bảng
      fetchReceiptById(selectedReceipt.id.toString()); // Lấy chi tiết phiếu nhập mới
    }
  };

  const handleComplete = async () => {
    // Filter products with quantity > 0
    const validProducts = products.filter(product => product.quantity > 0);
  
    // Check if there are no valid products
    if (validProducts.length === 0) {
      toast.error('Yêu cầu chọn ít nhất một sản phẩm!');
      return;
    }
  
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Xác nhận gửi phiếu nhập',
      text: "Bạn có chắc chắn muốn gửi phiếu nhập không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, gửi đi!'
    });
  
    if (result.isConfirmed) {
      try {
        const receiptDetails = validProducts.map((product) => ({
          batchDetail_Id: product.idBath,
          product_Id: product.id,
          purchasePrice: product.price,
          quantity: product.quantity,
        }));
  
        const data = {
          receipt: receiptID,
          price: validProducts.reduce((total, product) => total + product.quantity * product.price, 0),
          employeeId: employee?.id||1,
          import_Export_Details: receiptDetails,
          note: note,
        };
  
        console.log('Dữ liệu gửi đi:', JSON.stringify(data));
  
        const response = await axiosInstance.post('http://localhost:8888/v1/api/deliveryNotes', data);
  
        if (response.status === 200 || response.status === 201) {
          console.log('Phiếu nhập được gửi thành công');
          await Swal.fire({
            title: 'Thành công!',
            text: 'Phiếu nhập được gửi thành công!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Clear data from the table and reset receipt information
          setProducts([]);
          setSelectedSupplier('');
          setSupplierName('');
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
          <h1 className="text-3xl font-bold text-black">TRẢ HÀNG NHẬP</h1>
          <div className="flex items-center space-x-2">
            <Select
              options={allReceipts.map((receipt) => ({
                value: receipt,
                label: `PN000${receipt.id} - ${receipt.supplier.supplierName}`,
              }))}
              onChange={handleSearchChange}
              className="w-80"
              placeholder="Tìm kiếm phiếu nhập..."
            />
          </div>
        </div>

        <ProductTable products={products} setProducts={setProducts} />
      </div>
      <div className="flex-1 w-1/3 p-4 border-l">
        <OrderInfo
          products={products}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
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

export default UpdateReceipt;
