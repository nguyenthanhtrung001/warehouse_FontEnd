import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance';
import '@/utils/fontSetup';
import { formatCurrency } from '@/utils/formatCurrency';
import { Employee } from '@/types/employee';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  idProduct: number;
  productName: string;
  quantityDeliveryDetail: number;
  quantityReceiptDetail: number;
  purchasePrice: number;
  price: number;
}

// Định nghĩa các màu sắc và kiểu dáng cho bảng
const colors = {
  headerBackground: '#4f81bd',
  headerText: '#ffffff',
  rowBackground: '#f9f9f9',
  rowAltBackground: '#eaeaea',
  summaryBackground: '#333333',
  summaryText: '#ffffff',
  cellBorder: '#dddddd',
};

const styles = StyleSheet.create({
  table: {
    marginVertical: 10,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 8,
    fontSize: 11,
    fontFamily: 'Roboto',
    textAlign: 'center',
    borderBottomColor: colors.cellBorder,
    borderBottomWidth: 1,
    flex: 1,
  },
  tableHeaderCell: {
    padding: 10,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: colors.headerBackground,
    color: colors.headerText,
    textAlign: 'center',
    borderBottomColor: colors.cellBorder,
    borderBottomWidth: 1,
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: colors.summaryBackground,
    paddingVertical: 6,
  },
  summaryCell: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: colors.summaryText,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
  },
});

// Tạo component bảng dữ liệu
interface TableProps {
  idSupplier: number;
  employee: Employee | null;
  year: number; // Nhận vào năm
  month: number; // Nhận vào tháng
}

const Table: React.FC<TableProps> = ({ idSupplier, employee, year, month }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>(`http://localhost:8888/v1/api/receipts/supplier/${idSupplier}`, {
          params: {
            warehouseId: employee?.warehouseId,
            year,
            month
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [idSupplier, employee, year, month]);

  // Tính tổng số lượng và đếm số lượng mặt hàng
  const totalQuantityReceiptDetail = products.reduce((acc, product) => acc + product.quantityReceiptDetail, 0);
  const totalQuantityDeliveryDetail = products.reduce((acc, product) => acc + product.quantityDeliveryDetail, 0);
  const totalPurchaseValue = products.reduce((acc, product) => acc + (product.purchasePrice * product.quantityReceiptDetail), 0);
  const totalDeliveryValue = products.reduce((acc, product) => acc + (product.price * product.quantityDeliveryDetail), 0);

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

      {/* Dữ liệu */}
      {products.map((product, index) => (
        <View
          style={[
            styles.tableRow,
            { backgroundColor: index % 2 === 0 ? colors.rowBackground : colors.rowAltBackground },
          ]}
          key={product.idProduct}
        >
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{product.productName}</Text>
          <Text style={styles.tableCell}>{product.quantityReceiptDetail}</Text>
          <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice * product.quantityReceiptDetail)}</Text>
          <Text style={styles.tableCell}>{product.quantityDeliveryDetail}</Text>
          <Text style={styles.tableCell}>{formatCurrency(product.price * product.quantityDeliveryDetail)}</Text>
        </View>
      ))}

      {/* Hàng tổng kết */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryCell}>Tổng cộng</Text>
        <Text style={styles.summaryCell}></Text>
        <Text style={styles.summaryCell}>{totalQuantityReceiptDetail}</Text>
        <Text style={styles.summaryCell}>{formatCurrency(totalPurchaseValue)}</Text>
        <Text style={styles.summaryCell}>{totalQuantityDeliveryDetail}</Text>
        <Text style={styles.summaryCell}>{formatCurrency(totalDeliveryValue)}</Text>
      </View>
    </View>
  );
};

export default Table;
