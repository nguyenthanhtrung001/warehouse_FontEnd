import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import file đăng ký font
import {formatCurrency} from '@/utils/formatCurrency';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  idProduct: number;
  productName: string;
  quantityDeliveryDetail: number;
  quantityReceiptDetail: number;
  purchasePrice: number;
  price: number;
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
interface TableProps {
  idSupplier: number; // Thêm idSupplier vào props
}

const Table: React.FC<TableProps> = ({ idSupplier }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>(`http://localhost:8888/v1/api/receipts/supplier/${idSupplier}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [idSupplier]); // Thêm idSupplier vào dependency array

  // Tính tổng số lượng và đếm số lượng mặt hàng
  const totalQuantityReceiptDetail = products.reduce((acc, product) => acc + product.quantityReceiptDetail, 0);
  const totalQuantityDeliveryDetail = products.reduce((acc, product) => acc + product.quantityDeliveryDetail, 0);
  const totalPurchasePrice = products.reduce((acc, product) => acc + product.purchasePrice, 0);
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const totalItems = products.length;

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableRow}>
        <Text style={styles.tableHeaderCell}>STT</Text>
        <Text style={styles.tableHeaderCell}>Tên mặt hàng</Text>
        <Text style={styles.tableHeaderCell}>Số lượng nhập</Text>
        <Text style={styles.tableHeaderCell}>Giá trị nhập</Text>
        <Text style={styles.tableHeaderCell}>Số lượng trả</Text>
        <Text style={styles.tableHeaderCell}>Giá trị trả</Text>
      </View>

      {/* Hàng tổng kết */}
      <View style={styles.summaryRow}>
        <Text style={styles.tableCell}>Tổng cộng</Text>
        <Text style={styles.tableCell}></Text>
        <Text style={styles.tableCell}>{totalQuantityReceiptDetail}</Text>
        <Text style={styles.tableCell}>{formatCurrency(totalPurchasePrice)}</Text>
        <Text style={styles.tableCell}>{totalQuantityDeliveryDetail}</Text>
        <Text style={styles.tableCell}>{formatCurrency(totalPrice)}</Text>
      </View>
      
      {/* Dữ liệu */}
      {products.map((product, index) => (
        <View style={styles.tableRow} key={product.idProduct}>
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{product.productName}</Text>
          <Text style={styles.tableCell}>{product.quantityReceiptDetail}</Text>
          <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice*product.quantityReceiptDetail)}</Text>
          <Text style={styles.tableCell}>{product.quantityDeliveryDetail}</Text>
          <Text style={styles.tableCell}>{formatCurrency(product.price* product.quantityDeliveryDetail)}</Text>
        </View>
      ))}

      
    </View>
  );
};

export default Table;
