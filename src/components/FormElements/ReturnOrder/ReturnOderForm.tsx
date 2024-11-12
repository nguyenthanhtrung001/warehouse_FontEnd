"use client"; // Đánh dấu component này là Client Component

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ProductTable from '@/components/FormElements/ReturnOrder/ProductTableOrder';
import OrderInfo from '@/components/FormElements/ReturnOrder/ReturnOrderInfo';
import ActionButtons from '@/components/FormElements/ReturnOrder/ActionButtons';
import { Product } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '@/utils/axiosInstance';
import Swal from 'sweetalert2'; // Import SweetAlert2
import API_ROUTES from '@/utils/apiRoutes'; // Import API_ROUTES
import { useEmployeeStore } from '@/stores/employeeStore';


const Home: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [invoice, setInvoice] = useState<string>();
  const [products, setProducts] = useState<Product[]>([]);
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customerName, setCustomer] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [refreshInvoices, setRefreshInvoices] = useState<boolean>(false); // Add state for refreshing invoices
  const { employee } = useEmployeeStore();


  useEffect(() => {
    const fetchInvoices = async () => {
      if (!employee || !employee.warehouseId) return;
      try {
        const response = await axios.get(API_ROUTES.INVOICES_BY_STATUS(2, employee?.warehouseId));
        const data: any[] = response.data;
        setAllInvoices(data);
      } catch (error) {
        console.error('Lỗi khi lấy hóa đơn:', error);
      }
    };

    fetchInvoices();
  }, [refreshInvoices,employee]); // Add refreshInvoices as a dependency

  const fetchReceiptById = async (invoiceId: string) => {
    try {
      const response = await axios.get(`${API_ROUTES.INVOICE_DETAILS}/${invoiceId}`);
      const data = response.data;
      console.log('Fetched Data:', JSON.stringify(data, null, 2)); // Xuất dữ liệu dưới dạng JSON

      if (data.length > 0) {
        const firstDetail = data[0]; // Chọn chi tiết đầu tiên
        const invoice = firstDetail.invoiceId;
        console.log(' Data test invoice:', JSON.stringify(invoice, null, 2)); // Xuất dữ liệu dưới dạng JSON


        // Cập nhật các giá trị trạng thái từ dữ liệu trả về
        setInvoice(firstDetail);
        setProducts(
          data.map((detail: any) => ({
            id: detail.productId,
            productName: detail.nameProduct,
            quantityReturn: detail.quantity,
            price: detail.purchasePrice,
            code: `MH000${detail.productId}`,
            note: detail.note_return,
          }))
        );
        setInvoice(invoiceId);
        // xem xet lại khách hàng
        setSelectedCustomer(invoice.customer.id.toString());
        setCustomer(invoice.customer.customerName.toString());
       
        setNote(firstDetail.note_return || '');
        setEmployeeId(invoice.employeeId);
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
      const selectedInvoice = selectedOption.value;
      setProducts([]); // Xóa toàn bộ bảng
      fetchReceiptById(selectedInvoice.id.toString()); // Lấy chi tiết hóa đơn mới
    }
  };

  const handleComplete = async () => {
    console.log('Invoice ID:', invoice); 
    const orderDetails = products
      .filter((product) => product.quantity > 0)
      .map((product) => ({
        productId: product.id,
        purchasePrice: product.price,
        quantity: product.quantity,
        note: product.note,
      }));

    const data = {
      invoiceId: Number(invoice),
      customer: parseInt(selectedCustomer),
      price: products
        .filter((product) => product.quantity > 0)
        .reduce((total, product) => total + product.quantity * product.price, 0),
      employeeId: employee?.id,
      returnDetails: orderDetails,
    };

    if (orderDetails.length === 0) {
      toast.error('Không có sản phẩm với số lượng hợp lệ để gửi!');
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Xác nhận gửi yêu cầu',
      text: 'Bạn có chắc chắn muốn gửi yêu cầu này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, gửi đi!',
      cancelButtonText: 'Hủy bỏ',
    });

    if (result.isConfirmed) {
      try {
        console.log('Dữ liệu gửi đi:', JSON.stringify(data));

        const response = await axios.post('http://localhost:8888/v1/api/return-notes', data);

        if (response.status === 200 || response.status === 201) {
          console.log('Đơn hàng được gửi thành công');

          // Xóa dữ liệu của bảng và thông tin đơn hàng
          setProducts([]);
          setSelectedCustomer('');
          setCustomer('');
          setExpiryDate('');
          setNote('');
          setLocation(0);
          setEmployeeId(0);

          // Hiển thị thông báo thành công
          await Swal.fire({
            title: 'Thành công',
            text: 'Đơn hàng được gửi thành công!',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          // Trigger invoice list refresh
          setRefreshInvoices(!refreshInvoices);
        } else {
          console.error('Gửi đơn hàng thất bại:', response.statusText);
          toast.error('Gửi đơn hàng thất bại!');
        }
      } catch (error) {
        console.error('Lỗi khi gửi đơn hàng:', error);
        toast.error('Lỗi khi gửi đơn hàng!');
      }
    }
  };

  return (
    <div className="flex w-full h-screen p-4 text-xs text-black">
      <ToastContainer />
      <div className="flex-2 w-2/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">TRẢ HÀNG</h1>
          <div className="flex items-center space-x-2">
            <Select
              options={allInvoices.map((invoice) => ({
                value: invoice,
                label: `HD000${invoice.id} - can fix KH`,
                //label: `HD000${invoice.id} - ${invoice.customer.customerName}`,
              }))}
              onChange={handleSearchChange}
              className="w-80"
              placeholder="Tìm kiếm hóa đơn..."
            />
          </div>
        </div>

        <ProductTable products={products} setProducts={setProducts} />
      </div>
      <div className="flex-1 w-1/3 p-4 border-l">
        <OrderInfo
          products={products}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setCustomer}
          setExpiryDate={setExpiryDate}
          setNote={setNote}
          setLocation={setLocation}
          setEmployeeId={setEmployeeId}
          customerName={customerName}
          expiryDate={expiryDate}
          note={note}
          location={location}
          employeeId={employeeId}
        />
        <div className="mt-4">
          <ActionButtons handleComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

export default Home;
