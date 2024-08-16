"use client"
import React from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductTableProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, setProducts }) => {
  const handleQuantityChange = (index: number, value: number) => {
    if (value >= 0 && value <= products[index].quantityReturn) {
      const newProducts = [...products];
      newProducts[index].quantity = value;
      setProducts(newProducts);
    }
  };

  const handlePriceChange = (index: number, value: number) => {
    const newProducts = [...products];
    newProducts[index].price = value;
    setProducts(newProducts);
  };

  const handleDeleteRow = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1); // Xóa phần tử tại index
    setProducts(newProducts);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-blue-700 font-bold text-white">
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Mã hàng</th>
            <th className="px-4 py-2 border">Tên hàng</th>
            
            <th className="px-4 py-2 border">Số lượng</th>
            <th className="px-4 py-2 border">Đơn giá</th>
           
            <th className="px-4 py-2 border">Thành tiền</th>
            <th className="px-4 py-2 border">Hành động</th> {/* Cột hành động */}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.code} className='text-black'>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-center font-bold text-blue-600">
              <Image
                  src={product.image || '/images/product/product-01.png'}
                  alt={product.productName}
                  width={48}  // Set width
                  height={48} // Set height
                  className="object-cover mr-3"
                />
                MH000{product.id}</td>
              <td className="px-4 py-2 border">{product.productName}</td>
             
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={product.quantity}
                  min={1}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  className="w-20 p-2 border-b border-blue-500 text-center"
                />/{product.quantityReturn}
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={product.price}
                  disabled
                  onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                  className="w-full p-2 border-b border-blue-500 text-center"
                />
              </td>
              
              <td className="px-4 py-2 border">{formatCurrency(product.quantity * product.price)}</td>
              <td className="px-4 py-2 border">
                <button onClick={() => handleDeleteRow(index)} className="px-4 py-1 bg-red text-white rounded-md">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
