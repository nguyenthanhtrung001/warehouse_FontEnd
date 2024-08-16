import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import { Product } from '@/types/product';

interface UpdateProductFormProps {
  selectedProduct: Product | null;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  selectedProduct,
  onClose,
  onUpdate,
}) => {
  const [updateForm, setUpdateForm] = useState<Partial<Product>>({});
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | string>('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.BRANDS);
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.PRODUCT_GROUPS);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setUpdateForm({
        productName: selectedProduct.productName,
        category: selectedProduct.category,
        brandName: selectedProduct.brandName,
        price: selectedProduct.price,
        weight: selectedProduct.weight,
        description: selectedProduct.description,
        image: selectedProduct.image,
        sold: selectedProduct.sold,
        profit: selectedProduct.profit,
        code: selectedProduct.code,
        unit: selectedProduct.unit,
        quantity: selectedProduct.quantity,
        quantityReturn: selectedProduct.quantityReturn,
        idBath: selectedProduct.idBath,
        discount: selectedProduct.discount,
        note: selectedProduct.note,
      });
      setSelectedCategoryId(selectedProduct.category);
      setSelectedBrandId(selectedProduct.brandName);
    }
  }, [selectedProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
    if (name === 'category') {
      setSelectedCategoryId(value);
    } else if (name === 'brandName') {
      setSelectedBrandId(value);
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      try {
        const confirmResult = await Swal.fire({
          title: 'Xác nhận cập nhật',
          text: "Bạn có chắc chắn muốn cập nhật sản phẩm này?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Cập nhật',
          cancelButtonText: 'Hủy',
        });

        if (confirmResult.isConfirmed) {
          const updatedProduct = {
            id: selectedProduct.id,
            productName: updateForm.productName || '',
            weight: updateForm.weight || 0,
            description: updateForm.description || '',
            productGroup: Number(selectedCategoryId) || -1,
            brand: Number(selectedBrandId) || -1,
            prices: updateForm.price || 0,
          };

          console.log('Updated Product:', updatedProduct);

          await axiosInstance.put(`${API_ROUTES.API_PRODUCTS}`, updatedProduct);
         
          onClose();

          Swal.fire({
            title: 'Thành công!',
            text: 'Sản phẩm đã được cập nhật thành công.',
            icon: 'success',
          });
        }
      } catch (error) {
        console.error('Error updating product: ', error);
        Swal.fire({
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi cập nhật sản phẩm.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmitUpdate} className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-md shadow-xl text-black">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-blue-800">
            Tên mặt hàng
          </label>
          <input
            type="text"
            name="productName"
            value={updateForm.productName || ''}
            onChange={handleInputChange}
            className="w-full bg-white rounded-lg border-[1.5px] border-blue-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-800">Nhóm hàng</label>
          <select
            name="category"
            value={selectedCategoryId || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Chọn nhóm hàng</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.groupName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-800">Thương hiệu</label>
          <select
            name="brandName"
            value={selectedBrandId || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-800">Trọng lượng</label>
          <input
            type="number"
            name="weight"
            value={updateForm.weight || 0}
            onChange={handleInputChange}
            className="w-full bg-white rounded-lg border-[1.5px] border-blue-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-blue-800">Mô tả</label>
        <textarea
          name="description"
          value={updateForm.description || ''}
          onChange={handleInputChange}
          className="w-full bg-white rounded-lg border-[1.5px] border-blue-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mt-6 text-center">
        <button type="submit" className="w-full py-3 mt-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cập nhật
        </button>
      </div>
    </form>
  );
};

export default UpdateProductForm;
