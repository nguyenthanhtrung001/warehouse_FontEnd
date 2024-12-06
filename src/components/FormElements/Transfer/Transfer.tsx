"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance"; // Import axios instance
import { FaPlus, FaTrash, FaArrowRight, FaWarehouse } from "react-icons/fa";
import type { Product } from "@/types/product"; // Import kiểu Product
import { useEmployeeStore } from "@/stores/employeeStore";
import type { Warehouse } from "@/types/warehouse";
import Swal from "sweetalert2"; // Import thư viện SweetAlert2

interface SelectedProduct extends Product {
  quantity: number; // Thêm trường số lượng cho sản phẩm đã chọn
}

const TransferPage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [currentWarehouse, setCurrentWarehouse] = useState<number | null>(null);
  const [targetWarehouse, setTargetWarehouse] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]); // Danh sách sản phẩm từ API
  const [defaultWarehouse, setDefaultWarehouse] = useState<Warehouse | null>(
    null,
  );

  // Thông tin nhân viên
  const { employee } = useEmployeeStore();

  // Gọi API khi kho hiện tại được chọn
  useEffect(() => {
    if (employee?.warehouseId) {
      axiosInstance
        .get(
          `http://localhost:8888/v1/api/batches/warehouse/${employee.warehouseId}`,
        )
        .then((response) => {
          const data: Product[] = response.data.map((item: any) => ({
            image: "", // Cập nhật trường này nếu có
            productName: item.productName,
            category: "", // Cập nhật nếu có
            price: 0, // Cập nhật nếu có
            sold: 0, // Cập nhật nếu có
            profit: 0, // Cập nhật nếu có
            brandName: "", // Cập nhật nếu có
            description: item.description,
            id: item.id,
            weight: item.weight,
            code: "", // Cập nhật nếu có
            unit: "", // Cập nhật nếu có
            quantity: item.quantity,
            quantityReturn: item.quantity, // Cập nhật nếu có
            idBath: 0, // Cập nhật nếu có
            discount: 0, // Cập nhật nếu có
            note: "", // Cập nhật nếu có
            batch: "", // Cập nhật nếu có
            location: "", // Cập nhật nếu có
          }));

          // Log dữ liệu nhận được
          console.log("Received products:", data);

          // Cập nhật state với dữ liệu nhận được
          setAvailableProducts(data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          alert("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
        });
    }
  }, [employee]);

  // Thêm biến để lưu giá trị id kho mặc định
  const defaultWarehouseId = employee?.warehouseId; // Ví dụ: lấy id = 2 làm tham số truyền vào

  useEffect(() => {
    if (employee?.warehouseId) {
      axiosInstance
        .get(`http://localhost:8888/v1/api/warehouses`)
        .then((response) => {
          const data: Warehouse[] = response.data;

          // Tìm kho mặc định
          const warehouse = data.find((w) => w.id === defaultWarehouseId);
          setDefaultWarehouse(warehouse || null);

          // Lọc danh sách kho trừ kho mặc định
          const filteredWarehouses = data.filter(
            (w) => w.id !== defaultWarehouseId,
          );
          setWarehouses(filteredWarehouses);
        })
        .catch((error) => {
          console.error("Error fetching warehouses:", error);
          alert("Có lỗi xảy ra khi lấy danh sách kho.");
        });
    }
  }, [employee]);

  const handleConfirmTransfer = () => {
    // Kiểm tra nếu chưa chọn kho đích hoặc danh sách sản phẩm chuyển trống
    if (!targetWarehouse || selectedProducts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn kho đích và thêm sản phẩm để chuyển.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Hiển thị hộp thoại xác nhận trước khi gửi
    Swal.fire({
      title: "Bạn có chắc chắn muốn chuyển hàng?",
      text: "Hãy chắc chắn rằng các thông tin đã chính xác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Tạo payload để gửi API
        const payload = {
          price: selectedProducts.reduce(
            (total, product) => total + product.price * product.quantity,
            0,
          ), // Tổng giá
          employeeId: employee?.id || 0, // ID nhân viên từ store
          import_Export_Details: selectedProducts.map((product) => ({
            product_Id: product.id,
            quantity: product.quantity,
          })),
          note: "", // Ghi chú
          warehouseId: defaultWarehouse?.id || 0, // ID kho hiện tại
          warehouseDestination: targetWarehouse, // ID kho đích
        };
        // Hiển thị payload trên console dưới dạng JSON
        console.log("Payload được gửi đi:", JSON.stringify(payload, null, 2));

        // Gọi API POST
        axiosInstance
          .post("http://localhost:8888/v1/api/deliveryNotes/transfer", payload)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Chuyển hàng thành công!",
              showConfirmButton: false,
              timer: 1500,
            });

            // Gọi lại các API để làm mới dữ liệu
            refreshData();

            // Xóa danh sách sản phẩm đã chọn sau khi xác nhận chuyển hàng
            setSelectedProducts([]);
          })
          .catch((error) => {
            console.error("Error during transfer:", error);
            Swal.fire({
              icon: "error",
              title: "Có lỗi xảy ra khi chuyển hàng!",
              text: "Vui lòng thử lại.",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const addProductToTransfer = (product: Product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const filteredProducts = availableProducts
    .filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 3); // Giới hạn hiển thị 3 sản phẩm

  const removeProductFromTransfer = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId),
    );
  };

  const updateProductQuantity = (productId: number, newQuantity: number) => {
    // Tìm sản phẩm cần cập nhật
    const product = selectedProducts.find((item) => item.id === productId);
    
    if (product) {
      // Kiểm tra điều kiện số lượng trả lại không vượt quá số lượng hiện tại
      if (product.quantityReturn > product.quantity ) {
        setSelectedProducts(
          selectedProducts.map((item) =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        // Điều kiện không thỏa mãn, có thể hiển thị thông báo lỗi
        Swal.fire({
          title: "Số lượng không hợp lệ",
          text: "Số lượng trả lại vượt quá số lượng sản phẩm có sẵn.",
          icon: "error",
        });
      }
    }
  };
  

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval);
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1); // Thêm state để quản lý trang hiện tại
  const productsPerPage = 3; // Số lượng sản phẩm trên mỗi trang

  // Sản phẩm phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = availableProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  // Tổng số trang
  const totalPages = Math.ceil(availableProducts.length / productsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  // Hàm làm mới dữ liệu sau khi chuyển hàng thành công
  const refreshData = () => {
    // Gọi lại API để lấy danh sách kho
    if (employee?.warehouseId) {
      // Gọi lại API để lấy danh sách sản phẩm
      axiosInstance
        .get(
          `http://localhost:8888/v1/api/batches/warehouse/${employee.warehouseId}`,
        )
        .then((response) => {
          const data: Product[] = response.data.map((item: any) => ({
            image: "",
            productName: item.productName,
            category: "",
            price: 0,
            sold: 0,
            profit: 0,
            brandName: "",
            description: item.description,
            id: item.id,
            weight: item.weight,
            code: "",
            unit: "",
            quantity: item.quantity,
            quantityReturn: item.quantity,
            idBath: 0,
            discount: 0,
            note: "",
            batch: "",
            location: "",
          }));
          setAvailableProducts(data);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-xl bg-gradient-to-r from-blue-50 to-white p-6 text-black shadow-lg">
      <h1 className="mb-6 text-center text-4xl font-bold text-blue-600">
        CHUYỂN HÀNG GIỮA CÁC KHO
      </h1>
      {/* Thêm thanh trạng thái chuyển kho */}
      <div className="mb-6 flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaWarehouse className="text-gray-600 text-2xl" />
          <span className="text-gray-700 text-lg font-semibold">
            {defaultWarehouse
              ? defaultWarehouse.warehouseName
              : "Không tìm thấy kho"}
          </span>
        </div>

        <FaArrowRight className="text-3xl text-blue-500" />

        <div className="flex items-center space-x-2">
          <FaWarehouse className="text-2xl text-blue-600 " />
          <span className="text-lg font-semibold text-blue-700">
            {targetWarehouse
              ? `Kho ${warehouses.find((w) => w.id === targetWarehouse)?.warehouseName}`
              : "Chưa chọn kho"}
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-col items-end">
        <div className="text-gray-700 text-xl font-medium">
          Nhân viên: {employee?.employeeName}
        </div>
        <div className="text-gray-500 text-sm">{currentDateTime}</div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label className="text-gray-700 mb-2 block text-lg font-semibold">
            Kho Hiện Tại:
          </label>
          <div className="border-gray-300 bg-gray-100 text-gray-700 block w-full rounded-lg border p-3">
            <span className="text-blue-700">
              {defaultWarehouse
                ? defaultWarehouse.warehouseName
                : "Không tìm thấy kho"}
            </span>
          </div>
        </div>

        <div>
          <label className="text-gray-700 mb-2 block text-lg font-semibold">
            Chuyển Đến:
          </label>
          <select
            className="border-gray-300 block w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setTargetWarehouse(Number(e.target.value))}
          >
            <option value="">Chọn Kho</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.warehouseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-gray-700 mb-2 block text-lg font-semibold">
          Tìm Kiếm Sản Phẩm Để Chuyển:
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-300 block w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Nhập tên sản phẩm"
        />
        <ul className="mt-4 space-y-2">
          {currentProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-lg bg-white p-3 shadow-md transition-transform hover:scale-105"
            >
              <span className="flex-1">{product.productName}</span>
              <span className="mr-10 w-20 text-center">
                Tồn: {product.quantity}
              </span>

              <button
                onClick={() => addProductToTransfer(product)}
                className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
              >
                <FaPlus className="mr-2" />
                Thêm
              </button>
            </li>
          ))}
        </ul>

        {/* Nút phân trang */}
        <div className="mt-4 flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded-lg px-4 py-2 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-gray-800 mb-4 text-2xl font-semibold">
          Danh sách sản phẩm chuyển
        </h2>
        <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-lg">
          <thead>
            <tr className="text-gray-700 bg-blue-200">
              <th className="px-6 py-3 text-left">Tên Sản Phẩm</th>
              <th className="px-6 py-3 text-center">Số Lượng</th>
              <th className="px-6 py-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-100 border-b transition-colors"
              >
                <td className="px-6 py-3">{product.productName}</td>
                <td className="px-6 py-3 text-center">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      updateProductQuantity(
                        product.id,
                     
                        Math.max(Number(e.target.value), 1),
                      )
                    }
                    className="border-gray-300 w-20 rounded-lg border p-2 text-center focus:outline-none"
                    min="1"
                  />
                </td>
                <td className="flex justify-center px-6 py-3 text-center">
                  <button
                    onClick={() => removeProductFromTransfer(product.id)}
                    className="hover:bg-red-600 flex items-center rounded-lg bg-red px-4 py-2 text-white transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Nút "Xác nhận chuyển hàng" */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleConfirmTransfer}
          className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Xác nhận chuyển hàng
        </button>
      </div>
    </div>
  );
};

export default TransferPage;
