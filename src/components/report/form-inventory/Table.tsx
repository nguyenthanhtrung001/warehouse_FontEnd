// src/components/Table.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import file đăng ký font
import API_ROUTES from '@/utils/apiRoutes';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  productName: string;
  weight: number;
  description: string;
  productGroup: {
    id: number;
    groupName: string;
  };
  brand: {
    id: number;
    brandName: string;
  };
  image: string[];
  price: number;
  quantity: number;
}

// Định nghĩa các kiểu dáng cho bảng
const styles = StyleSheet.create({
  table: {
    margin: '10px 0',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 4,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
    textAlign: 'center',
    flex: 1,
  },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
    fontWeight: 'bold',
    backgroundColor: '#3c50e0', // Màu nền xanh dương cho header
    color: '#ffffff', // Màu chữ trắng cho header
    textAlign: 'center',
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f0ad4e', // Màu nền cho hàng tổng kết
  },
});

// Tạo component bảng dữ liệu
const Table = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>(API_ROUTES.API_PRODUCTS);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Tính tổng số lượng và đếm số lượng mặt hàng
  const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalItems = products.length;

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableRow}>
        <Text style={styles.tableHeaderCell}>STT</Text>
        <Text style={styles.tableHeaderCell}>Tên mặt hàng</Text>
        <Text style={styles.tableHeaderCell}>Nhóm hàng</Text>
        <Text style={styles.tableHeaderCell}>Số lượng tồn</Text>
      </View>
       {/* Hàng tổng kết */}
       <View style={styles.summaryRow}>
        <Text style={styles.tableCell}>Tổng cộng</Text>
        <Text style={styles.tableCell}>{totalItems} mặt hàng</Text>
        <Text style={styles.tableCell}></Text>
        <Text style={styles.tableCell}>{totalQuantity}</Text>
      </View>
      {/* Dữ liệu */}
      {products.map((product, index) => (
        <View style={styles.tableRow} key={product.id}>
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{product.productName}</Text>
          <Text style={styles.tableCell}>{product.productGroup.groupName}</Text>
          <Text style={styles.tableCell}>{product.quantity}</Text>
        </View>
      ))}

     
    </View>
  );
};

export default Table;
