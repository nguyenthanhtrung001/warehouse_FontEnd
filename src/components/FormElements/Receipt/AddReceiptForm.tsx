"use client"
// pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import ProductTable from '@/components/FormElements/Receipt/ProductTableReceipt';
import OrderInfo from '@/components/FormElements/Receipt/OrderInfo';
import ActionButtons from '@/components/FormElements/Receipt/ActionButtons';
import { Product } from '@/types/product';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import Swal from 'sweetalert2';
import Modal from '@/components/Modal/Modal';
import FormAddProduct from '@/components/FormElements/product/AddProductForm';
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';



const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const { employee } = useEmployeeStore();


  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get<Product[]>(API_ROUTES.API_PRODUCTS);
      const productsWithQuantity = response.data.map((product) => ({
        ...product,
        quantity: 1, // Đặt quantity mặc định là 1
      }));
      setAllProducts(productsWithQuantity);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      toast.error('Lỗi khi lấy sản phẩm');
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedProduct: Product = selectedOption.value;
      setProducts((prevProducts) => [...prevProducts, selectedProduct]);
    }
  };
  const handleCloseModal = () => {
    setShowAddProductForm(false);
    fetchProducts(); 
  };

  const handleComplete = async () => {
    if (!batchName.trim()) {
      toast.error('Tên lô hàng không được bỏ trống');
      return;
    }
  
    if (!location) {
      toast.error('Vị trí kho không được để trống');
      return;
    }
  
    if (!selectedSupplier.trim()) {
      toast.error('Nhà cung cấp không được để trống');
      return;
    }
  
    const importExportDetails = products
      .filter((product) => product.quantity > 0)
      .map((product) => ({
        product_Id: product.id,
        purchasePrice: product.price,
        quantity: product.quantity,
      }));
  
    if (importExportDetails.length === 0) {
      toast.error('Không có sản phẩm hợp lệ để gửi');
      return;
    }
  
    Swal.fire({
      title: 'Bạn có chắc chắn muốn gửi?',
      text: 'Hãy chắc chắn rằng mọi thông tin đã chính xác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, gửi đi!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            supplier: parseInt(selectedSupplier),
            price: products.reduce((total, product) => total + product.quantity * product.price, 0),
            employeeId: employee?.id||1,
            import_Export_Details: importExportDetails,
            batchName: batchName,
            expiryDate: expiryDate,
            note: note,
            location: location,
          };
          console.log('Dữ liệu gửi đi:', JSON.stringify(data));
          const response = await axios.post(API_ROUTES.RECEIPTS, data);
  
          if (response.status === 200 || response.status === 201) {
            await Swal.fire({
              title: 'Thành công!',
              text: 'Phiếu nhập hàng được gửi thành công',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            // Reset form after successful submission
            setProducts([]);
            setSelectedSupplier('');
            setBatchName('');
            setExpiryDate('');
            setNote('');
            setLocation(0);
            setEmployeeId(0);
          } else {
            console.error('Gửi phiếu nhập hàng thất bại:', response.statusText);
            toast.error('Gửi phiếu nhập hàng thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi gửi phiếu nhập hàng:', error);
          toast.error('Lỗi khi gửi phiếu nhập hàng');
        }
      }
    });
  };
  

  return (
    <div className="flex w-full h-screen p-4 text-xs text-black">
      <ToastContainer />
      <div className="flex-2 w-2/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">NHẬP HÀNG</h1>
          <div className="flex items-center space-x-2">
            <Select
              options={allProducts.map((product) => ({
                value: product,
                label: `${product.id} - ${product.productName}`,
              }))}
              onChange={handleSearchChange}
              className="w-80"
              placeholder="Tìm kiếm mã hàng..."
            />
            <button 
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
            onClick={() => setShowAddProductForm(true)} >
              +
            </button>
          </div>
        </div>
        <ProductTable products={products} setProducts={setProducts} />
       
      </div>
      <Modal isVisible={showAddProductForm} onClose={handleCloseModal} title="THÊM SẢN PHẨM">
        <FormAddProduct />
      </Modal>

      <div className="flex-1 w-1/3 p-4 border-l">
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
          <ActionButtons handleComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

export default Home;
