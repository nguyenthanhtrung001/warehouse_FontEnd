"use client";
import React, { useState, useEffect } from "react";
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
import { encrypt } from "@/utils/cryptoUtils"; // Import hàm mã hóa
import { useEmployeeStore, initializeEmployeeFromLocalStorage } from '@/stores/employeeStore';


const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [batchName, setBatchName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [location, setLocation] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const router = useRouter(); 
  const { employee } = useEmployeeStore();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS);
        const data: Product[] = response.data;
        const filteredProducts = data
        .filter((product) => product.quantity > 0)
        .map((product) => ({
          ...product,
          quantityReturn: product.quantity,
          quantity: 0, // Khởi tạo quantity bằng 0
          
        }));

      // Cập nhật state với danh sách sản phẩm đã lọc
      setAllProducts(filteredProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        toast.error("Lỗi khi lấy sản phẩm");
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedProduct: Product = selectedOption.value;
      setProducts((prevProducts) => [...prevProducts, selectedProduct]);
    }
  };

  

  const handleComplete = async () => {
    // Kiểm tra xem danh sách sản phẩm có ít nhất một sản phẩm không
  if (products.length === 0) {
    toast.error("Danh sách sản phẩm không thể trống.");
    return;
  }

  if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }

    const invalidProducts = products.filter(
      (product) => product.quantity <= 0
    );
    if (invalidProducts.length > 0) {
      toast.error("Số lượng sản phẩm phải lớn hơn 0");
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
            customer: parseInt(selectedCustomer),
            price: products.reduce(
              (total, product) => total + product.quantity * product.price,
              0
            ),
            employeeId: employee?.id||1,
            order_Details: orderDetails,
            note: note,
          };
          console.log("Dữ liệu gửi đi:", JSON.stringify(data));

          const response = await axiosInstance.post(
            API_ROUTES.INVOICES,
            data
          );

          
          if (response.status === 200 || response.status === 201) {
            console.log("Đơn hàng được gửi thành công");
            
             // Lấy ID đơn hàng từ phản hồi API
             const orderId = response.data.id; // Giả sử response trả về id đơn hàng
             console.log("response.data.id:",response.data.id);
             const encryptedOrderId = encrypt(orderId.toString());

            Swal.fire({
              title: "Thành công!",
              text: "Đơn hàng của bạn đã được gửi thành công.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              // Điều hướng đến trang xác nhận thanh toán sau khi đơn hàng được gửi thành công
              router.push(`/order/confirm?orderId=${encodeURIComponent(encryptedOrderId)}`);
            });


            // Xóa tất cả dữ liệu đang hiển thị sau khi gửi thành công
            setProducts([]);
            setSelectedCustomer("");
            setBatchName("");
            setExpiryDate("");
            setNote("");
            setLocation(0);
            setEmployeeId(0);
          } else {
            console.error("Gửi đơn hàng thất bại:", response.statusText);
            toast.error("Gửi đơn hàng thất bại");
          }
        } catch (error) {
          console.error("Lỗi khi gửi đơn hàng:", error);
          Swal.fire({
            title: 'Thất bại!',
            text: 'Lỗi',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  return (
    <div className="flex w-full h-screen p-4 text-xs text-black ">
      <div className="flex-2 w-2/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">ĐẶT HÀNG</h1>
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
          </div>
        </div>
        <ProductTable products={products} setProducts={setProducts} />
      </div>
      <div className="flex-1 w-1/3 p-4 border-l">
        <OrderInfo
          products={products}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
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
        <div className="mt-4">
          <ActionButtons handleComplete={handleComplete} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
