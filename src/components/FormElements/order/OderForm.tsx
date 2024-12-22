"use client";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import ProductTable from "@/components/FormElements/order/ProductTableOrder";
import OrderInfo from "@/components/FormElements/order/OrderInfo";
import ActionButtons from "@/components/FormElements/order/ActionButtons";
import { Product } from "@/types/product";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import { useRouter } from 'next/navigation';
import { encrypt } from "@/utils/cryptoUtils";
import { useEmployeeStore } from '@/stores/employeeStore';
import axios from "axios";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const selectedCustomer = useRef<any>(null);
  const selectedAddress = useRef<any>(null);
  const [note, setNote] = useState<string>("");
  const router = useRouter();
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!employee?.warehouseId) return;
      try {
        const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS_HAS_LOCATION_BATCH(employee.warehouseId));
        const filteredProducts = response.data
          .filter((product: Product) => product.quantity > 0)
          .map((product: Product) => ({ ...product, quantityReturn: product.quantity, quantity: 0 }));
        setAllProducts(filteredProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        toast.error("Lỗi khi lấy sản phẩm");
      }
    };

    fetchProducts();
  }, [employee]);

  const handleComplete = async () => {
    if (!selectedCustomer.current || !selectedAddress.current) {
      toast.error("Vui lòng chọn khách hàng và địa chỉ.");
      return;
    }

    if (products.length === 0) {
      toast.error("Danh sách sản phẩm không thể trống.");
      return;
    }

    Swal.fire({
      title: "Đặt hàng?",
      text: "Hành động này sẽ gửi đơn hàng của bạn.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, gửi đơn hàng!",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderDetails = products.map((product) => ({
            product_Id: product.id,
            purchasePrice: product.price,
            quantity: product.quantity,
          }));
         
          const data = {
            customer: selectedCustomer.current.id,
            contactId: selectedAddress.current.id,
            price: products.reduce((total, product) => total + product.quantity * product.price, 0),
            employeeId: employee?.id,
            order_Details: orderDetails,
            note: note,
            warehouseId: employee?.warehouseId,
          };
          console.log("data gửi đi: ",JSON.stringify(data, null,2));

          const response = await axiosInstance.post(API_ROUTES.INVOICES, data);
          console.log("id order: ",response);
          if (response.status === 200 || response.status === 201) {
           
            const orderId = response.data.data.id;
           
            const encryptedOrderId = encrypt(orderId.toString());

            Swal.fire({
              title: "Thành công!",
              text: "Đơn hàng của bạn đã được gửi thành công.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              router.push(`/order/confirm?orderId=${encodeURIComponent(encryptedOrderId)}`);
            });

            setProducts([]);
            setNote("");
            selectedCustomer.current = null;
            selectedAddress.current = null;
          } else {
            toast.error("Gửi đơn hàng thất bại");
          }
        } catch (error: unknown) {
          console.error("Lỗi khi gửi đơn hàng:", error);
  
          if (axios.isAxiosError(error)) {
            // Xử lý lỗi từ phản hồi API
            if (error.response && error.response.data && error.response.data.data) {
              const errorMessage = error.response.data.data; // Lấy thông báo lỗi từ API
              Swal.fire({
                title: 'Thất bại!',
                text: errorMessage, // Hiển thị thông báo lỗi chi tiết từ API
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Thất bại!',
                text: 'Lỗi khi gửi đơn hàng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else {
            // Xử lý lỗi không phải từ Axios (ví dụ: lỗi kết nối mạng)
            Swal.fire({
              title: 'Thất bại!',
              text: 'Có lỗi xảy ra khi gửi đơn hàng. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      }
    });
  };

  return (
    <div className="flex h-screen w-full p-2 text-xs text-black">
      <div className="flex-2 w-2/3 p-2">
        {/* Nút Quay Lại */}
        <button
          className="text-sm bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 mb-5 rounded-md px-4 py-1 text-black shadow-lg focus:outline-none focus:ring-2"
          onClick={() => window.history.back()}
        >
          ← Quay lại
        </button>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">ĐẶT HÀNG</h1>
          <div className="flex items-center space-x-2">
            <Select
              options={allProducts.map((product) => ({
                value: product,
                label: `${product.id} - ${product.productName}`,
              }))}
              onChange={(selectedOption) => {
                const selectedProduct = selectedOption?.value;
                if (selectedProduct) {
                  setProducts((prevProducts) => [...prevProducts, selectedProduct]);
                }
              }}
              className="w-80"
              placeholder="Tìm kiếm mã hàng..."
            />
          </div>
        </div>
        <ProductTable products={products} setProducts={setProducts} />
      </div>

      <div className="w-1/3 flex-1 border-l p-4">
        <OrderInfo
          products={products}
          selectedCustomer={selectedCustomer}
          selectedAddress={selectedAddress}
          setNote={setNote}
          note={note}
        />
        <div className="mt-4">
          <ActionButtons handleComplete={handleComplete} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
