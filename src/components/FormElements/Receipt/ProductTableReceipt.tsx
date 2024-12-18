"use client"
import React from 'react';
import { Product } from '@/types/product';
import ProductSuggestionList from './ProductSuggestionList';
import Image from 'next/image';

interface ProductTableProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, setProducts }) => {
  const handleQuantityChange = (index: number, value: number) => {
    const newProducts = [...products];
    newProducts[index].quantity = value;
    setProducts(newProducts);
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
  const handleProductSelect = (product: Product) => {
    const newProducts = [...products];
    const existingProductIndex = newProducts.findIndex(p => p.id === product.id);
    if (existingProductIndex > -1) {
      // If product already exists, update quantity
      newProducts[existingProductIndex].quantity += 1;
    } else {
      // Otherwise, add new product
      newProducts.push({ ...product, quantity: 1 });
    }
    setProducts(newProducts);
  };

  return (
    <div className="overflow-x-auto text-black">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-blue-700 font-bold text-white font-bold">
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
            <tr key={product.code}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-center text-blue-700 font-bold">
                <Image
                  src={product.image || '/images/logo/dog-logo.png'}
                  alt={product.productName}
                  width={48}  // Adjust width
                  height={48} // Adjust height
                  className="w-12 h-12 object-cover mr-3"
                /> MH000{product.id}
              </td>
              <td className="px-4 py-2 border">{product.productName}</td>
             
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  className="w-full p-2 border-b border-blue-500 text-center"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={product.price}
                  min={0}
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
      <ProductSuggestionList onProductSelect={handleProductSelect} />
    </div>
  );
};

export default ProductTable;
