"use client"; // src/components/TableProduct.tsx
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import CheckboxTwo from '@/components/Checkboxes/CheckboxTwo';
import FormAddProduct from '@/components/FormElements/product/AddProductForm';
import Modal from '@/components/Modal/Modal';
import SearchInput from '@/components/Search/SearchInputProps';
import API_ROUTES from '@/utils/apiRoutes'; // Import URL từ apiRoutes.ts
import axiosInstance from '@/utils/axiosInstance';
import UpdateProductForm from '@/components/FormElements/product/UpdateProductForm';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useEmployeeStore } from '@/stores/employeeStore';

const TableProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showUpdateProductForm, setShowUpdateProductForm] = useState(false);
  const { employee } = useEmployeeStore();
  // Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Số sản phẩm mỗi trang

  const fetchProducts = async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get(API_ROUTES.API_PRODUCTS_HAS_LOCATION_BATCH(employee.warehouseId));
      const productList = await Promise.all(
        response.data.map(async (item: any) => ({
          id: item.id,
          image: item.image?item.image:'/images/product/product-01.png', // Đường dẫn ảnh giả định
          productName: item.productName,
          category: item.productGroup ? item.productGroup.groupName : 'Unknown',
          brandName: item.brand ? item.brand.brandName : 'Unknown',
          price: item.price,
          sold: item.quantity,
          profit: 0,
          description: item.description,
          weight: item.weight,
          location: item.batchLocation.location,
          batch: item.batchLocation.bath,
        }))
      );
      productList.sort((a, b) => b.sold - a.sold);
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products: ', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [employee]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const productName = product.productName || '';
      const brandName = product.brandName || '';
      const category = product.category || '';

      return (
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = async (product: Product) => {
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCloseModal = () => {
    setShowAddProductForm(false);
    setShowUpdateProductForm(false);
    fetchProducts(); // Tải lại dữ liệu khi modal đóng
  };

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      setShowUpdateProductForm(true);
    }
  };

  const handleUpdate = (updatedProduct: Product) => {
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận ngừng kinh doanh',
        text: "Bạn chắc chắn muốn ngừng kinh doanh mặt hàng này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        cancelButtonText: 'Quay lại'
      });

      if (result.isConfirmed) {
        await axiosInstance.put(API_ROUTES.UPDATE_PRODUCT_STATUS_DELETE(productId));
        fetchProducts();
        Swal.fire(
          'Thành công!',
          'Mặt hàng đã ngừng kinh doanh.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error canceling product: ", error);
      Swal.fire(
        'Thất bại!',
        'Đã xảy ra lỗi khi xóa mặt hàng.',
        'error'
      );
    }
  };

  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white mt-1">
              MẶT HÀNG
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
            />
          </div>
          <div className="col-span-1 px-1"></div>
          <div className="col-span-3 px-2 font-bold">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded  flex justify-end"
              onClick={() => setShowAddProductForm(true)}
            >
              Thêm mới
            </button>
            {/* <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isVisible={showAddProductForm} onClose={handleCloseModal} title="THÊM SẢN PHẨM">
        <FormAddProduct />
      </Modal>
       {/* Update Product Form */}
       <Modal isVisible={showUpdateProductForm} onClose={handleCloseModal} title="CẬP NHẬT SẢN PHẨM">
        <UpdateProductForm
          selectedProduct={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold">
          <div className="col-span-4 font-medium ml-6">Tên mặt hàng</div>
          <div className="col-span-2 font-medium">Nhóm hàng</div>
          <div className="col-span-2 font-medium">Thương hiệu</div>
          <div className="col-span-2 font-medium">Tồn kho</div>
          <div className="col-span-2 font-medium">Giá</div>
        </div>
      </div>

      {currentItems.map((product) => (
        <React.Fragment key={product.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                onClick={() => handleProductClick(product)}
              >
                <CheckboxTwo />
                <div className="w-12 h-12 rounded-md">
                  <Image
                    src={product.image}
                    width={48} // Adjust the width as needed
                    height={64} // Adjust the height as needed
                    alt="Product"
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm text-black dark:text-white mr-3">{product.productName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{product.category}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{product.brandName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{product.sold}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-meta-3">{formatCurrency(product.price)}</p>
              </div>
            </div>
          </div>

          {selectedProduct && selectedProduct.id === product.id && (
            <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 ">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-3 block font-bold text-blue-500 dark:text-white text-3xl py-5">
                      <h1>{product.productName}</h1>
                    </label>
                    <div className="grid grid-cols-1 w-128  h-132">
                      <Image
                        src={product.image}
                        width={200} // Adjust the width as needed
                        height={232} // Adjust the height as needed
                        alt="Product"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="col-span-5 py-8 text-black bg-blue-50 px-5">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Mã mặt hàng: <span className="font-bold ml-2">MH000{product.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Nhóm mặt hàng: <span className="font-bold ml-2 ">{product.category}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Loại mặt hàng: <span className="font-bold ml-2">Hàng hóa</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Thương hiệu: <span className="font-bold ml-2">{product.brandName}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Giá bán: <span className="font-bold ml-2">{formatCurrency(product.price)}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Trọng lượng: <span className="font-bold ml-2">{product.weight} g</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Vị trí: <span className="font-bold ml-2">{product.location}</span></li>
                    </ul>
                  </div>

                  <div className="col-span-3 py-8 bg-blue-50 px-5">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Mô tả
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Mô tả sản phẩm"
                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        disabled
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Lô hàng: {product.batch}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 mt-3 ">
                  <div className="col-span-6"></div>
                  <div className="col-span-6 flex justify-end">
                    <button
                      className="text-white px-4 py-2 rounded mr-2 font-bold bg-blue-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click trên container ảnh hưởng
                        handleUpdateProduct();
                      }}
                    >
                      Cập nhật
                    </button> 
                    <button  onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red text-white px-4 py-2 rounded mr-2 font-bold">
                      Ngừng kinh doanh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
        {/* Phân trang */}
        {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Trước
          </button>
          <span className="px-4 py-2 mx-1">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default TableProduct;
