// src/components/Table.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance';
import '@/utils/fontSetup';
import API_ROUTES from '@/utils/apiRoutes';
import { Employee } from '@/types/employee';

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
const colors = {
  headerBackground: '#3c50e0',
  headerText: '#ffffff',
  rowBackground: '#f7f9fc',
  rowAltBackground: '#e1e6f8',
  summaryBackground: '#f0ad4e',
  cellBorder: '#cccccc',
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
    padding: 8,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: colors.headerBackground,
    color: colors.headerText,
    textAlign: 'center',
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
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
  },
});

// Tạo component bảng dữ liệu
interface TableProps {
  employee: Employee | null;
}

const Table = ({ employee }: TableProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!employee || !employee.warehouseId) return;
      try {
        const response = await axiosInstance.get<Product[]>(API_ROUTES.BATCHES_BY_WAREHOUSE(employee?.warehouseId));
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
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
        <Text style={styles.tableHeaderCell}>Số lượng tồn</Text>
      </View>
      {/* Hàng tổng kết */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryCell}>Tổng cộng</Text>
        <Text style={styles.summaryCell}>{totalItems} mặt hàng</Text>
        <Text style={styles.summaryCell}>{totalQuantity}</Text>
      </View>

      {/* Dữ liệu */}
      {products.map((product, index) => (
        <View
          style={[
            styles.tableRow,
            { backgroundColor: index % 2 === 0 ? colors.rowBackground : colors.rowAltBackground },
          ]}
          key={product.id}
        >
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{product.productName}</Text>
          <Text style={styles.tableCell}>{product.quantity}</Text>
        </View>
      ))}

      
    </View>
  );
};

export default Table;
