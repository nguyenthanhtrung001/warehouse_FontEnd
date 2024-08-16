"use client"
import React from 'react';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}
const ProductTable: React.FC<ProductTableProps> = ({ products, setProducts }) => {
  const handleQuantityChange = (index: number, value: number) => {
    if (value >= 0 ) {
      const newProducts = [...products];
      newProducts[index].quantity = value;
      setProducts(newProducts);
    }
  };

  const handleDeleteRow = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1); // Xóa phần tử tại index
    setProducts(newProducts);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-blue-200 font-bold text-white bg-blue-700">
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Mã kho</th>
            <th className="px-4 py-2 border">Lô hàng</th>
            
            <th className="px-4 py-2 border">Số lượng</th>
            <th className="px-4 py-2 border">Tăng</th>
            <th className="px-4 py-2 border">Giảm</th>
           
            {/* <th className="px-4 py-2 border">Thành tiền</th> */}
            <th className="px-4 py-2 border">Hành động</th> {/* Cột hành động */}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.code}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-center text-blue-700 font-bold">MK00{product.id}</td>
              <td className="px-4 py-2 border">{product.productName}</td>
             
             
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  className="w-20 p-2 border-b border-blue-500 text-center"
                /><span className="text-blue-800 font-bold text-center">/ {product.quantityReturn}</span>
              </td>
              <td className="px-4 py-2 border text-center text-green-700 font-bold">  {Math.max(product.quantity - product.quantityReturn, 0)}</td>
              <td className="px-4 py-2 border text-center text-red font-bold">{Math.min(product.quantity - product.quantityReturn, 0)}</td>
              {/* <td className="px-4 py-2 border">{formatCurrency(product.quantity * product.price)}</td> */}
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