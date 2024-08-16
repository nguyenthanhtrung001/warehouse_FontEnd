"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import thư viện thông báo

interface Item {
  barcode: string;
  name: string;
  category: string;
  brand: string;
  location: string;
  costPrice: string;
  salePrice: string;
  stock: string;
  weight: string;
  directSale: boolean;
}

export default function AddItemForm() {
  const [item, setItem] = useState<Item>({
    barcode: '',
    name: '',
    category: '',
    brand: '',
    location: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    weight: '',
    directSale: false,
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:8084/api/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8084/api/product-groups');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      setItem({
        ...item,
        [name]: e.target.checked,
      });
    } else {
      setItem({
        ...item,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8888/v1/api/products', {
        productName: item.name,
        weight: parseFloat(item.weight),
        description: '', // Update with actual description if needed
        status: 1, // Update with actual status if needed
        productGroup: {
          id: 1, // Update with actual product group id from state or selection
          groupName: item.category,
        },
        brand: {
          id: 1, // Update with actual brand id from state or selection
          brandName: item.brand,
        },
      });

      console.log('Product created:', response.data);
      // thêm acaus trúc api để thông báo
      toast.success('Sản phẩm đã được thêm thành công!'); // Thông báo thành công
 
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Lỗi khi thêm sản phẩm. Vui lòng thử lại.'); // Thông báo lỗi

      // Handle error (show error message, log, etc.)
    }
  }; 
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-2">
          <div className="col-span-1">
            <label className="block text-sm font-bold">Tên hàng</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700">Giá bán</label>
            <input
              type="number"
              name="salePrice"
              value={item.salePrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700">Nhóm hàng</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            >
              <option value="">Chọn nhóm hàng</option>
              {categories.map((category) => (
                <option key={category.id} value={category.groupName}>
                  {category.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700">Vị trí</label>
            <input
              type="text"
              name="location"
              value={item.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700">Thương hiệu</label>
            <select
              name="brand"
              value={item.brand}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.brandName}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700">Trọng lượng</label>
            <input
              type="number"
              name="weight"
              value={item.weight}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-transparent focus:ring-0 sm:text-base"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-black dark:text-white">
              Hình ảnh
            </label>
            <input
              type="file"
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Mô tả
          </label>
          <textarea
            rows={3}
            placeholder="Mô tả"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>

        <div className="mt-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="directSale"
              checked={item.directSale}
              onChange={handleChange}
              className="form-checkbox h-6 w-6 text-indigo-600 focus:outline-none focus:border-transparent focus:ring-0"
            />
            <span className="ml-2 text-base text-gray-700">Bán trực tiếp</span>
          </label>
        </div>

        <div className="mt-6 text-center">
          <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-6 rounded">
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
