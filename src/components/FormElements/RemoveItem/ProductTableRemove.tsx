"use client"
import React from 'react';
import { Product } from '@/types/product';
import ProductExpiredList from './ProductExpiredList';
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

  const handleProductSelect = (product: Product) => {
    const newProducts = [...products];
    const existingProductIndex = newProducts.findIndex(p => p.id === product.id);
    
    if (existingProductIndex > -1) {
      // If product already exists, update quantity and price
      newProducts[existingProductIndex] = {
        ...newProducts[existingProductIndex],
        quantityReturn: product.quantity,
        price : 20-10,
       
      };
    } else {
      // Otherwise, add new product with quantity set to 1
      newProducts.push({ ...product, quantity: 1 });
    }
    
    setProducts(newProducts);
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
            <th className="px-4 py-2 border">HSD</th>
           
            {/* <th className="px-4 py-2 border">Thành tiền</th> */}
            <th className="px-4 py-2 border">Hành động</th> {/* Cột hành động */}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.code}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border  text-blue-700 font-bold">
              <Image
                  src={product.image || '/images/product/product-01.png'}
                  alt={product.productName}
                  width={48}  // Set width
                  height={48} // Set height
                  className="object-cover mr-3"
                />
                MK00{product.id}</td>
              <td className="px-4 py-2 border">{product.productName}</td>
             
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  className="w-20 p-2 border-b border-blue-500 text-center"
                /><span className="text-blue-800 font-bold text-center">/ {product.quantityReturn}</span>
              </td>
              <td className="px-4 py-2 border">{product.note}</td>
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
      {/* <ProductExpiredList onProductSelect={handleProductSelect} /> */}
    </div>
  );
};

export default ProductTable;
