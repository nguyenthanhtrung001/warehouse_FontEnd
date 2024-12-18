// components/ProductSuggestionList.tsx
import React, { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import { formatCurrency } from '@/utils/formatCurrency';
import { Product } from '@/types/product'; // Sử dụng kiểu từ file chung
import Image from 'next/image';
import { useEmployeeStore } from '@/stores/employeeStore';


interface ProductSuggestionListProps {
  onProductSelect: (product: Product) => void; // Sử dụng kiểu đúng
  reset: boolean; // Thêm prop reset
}

const ProductSuggestionList: React.FC<ProductSuggestionListProps> = ({ onProductSelect, reset }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!employee || !employee.warehouseId) return;
        const warehouseId = employee?.warehouseId; // Ví dụ, thay thế bằng ID kho thực tế của bạn
        const response = await axios.get<Product[]>('http://localhost:8888/v1/api/products/expired', {
          params: {
            warehouseId: warehouseId
          }
        });
        
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        setError('Không thể tải sản phẩm.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (reset) {
      setProducts([]); // Hoặc thực hiện các hành động reset khác
    }
  }, [reset]);
  
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-32 text-black col-span-12 rounded-sm border border-stroke bg-white px-3 pb-4 pt-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:col-span-5">
      <h2 className="text-xl font-bold mb-4"><span className='text-red'>Hết hạn sử dụng</span></h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(product => (
          <li
            key={product.id}
            className="flex items-center p-3 border rounded shadow-sm cursor-pointer"
            onClick={() => onProductSelect(product)}
          >
            <Image
              src={product.image || '/images/product/product-01.png'}
              alt={product.productName}
              width={72}  // Set width
              height={72} // Set height
              className="object-cover mr-3"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">{product.productName}</h3>
              <p className="text-xs text-gray-600 mb-1 ">Tồn kho: {product.quantity}</p>
              <p className="text-sm font-bold">{product.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSuggestionList;
