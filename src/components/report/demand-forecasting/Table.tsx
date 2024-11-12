// src/components/Table.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import file đăng ký font
import API_ROUTES from '@/utils/apiRoutes';

// Định nghĩa kiểu dữ liệu cho dự đoán sản phẩm
interface ProductPrediction {
  product: {
    id: number;
    productName: string;
  };
  predict: number;
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
    fontFamily: 'Roboto',
    textAlign: 'center',
    flex: 1,
  },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: '#3c50e0',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f0ad4e',
  },
});

const Table = () => {
  const [predictions, setPredictions] = useState<ProductPrediction[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axiosInstance.get<ProductPrediction[]>('http://localhost:8888/v1/api/predict/list');
        setPredictions(response.data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
  }, []);

  // Tính tổng dự đoán
  const totalPredictedQuantity = predictions.reduce((acc, prediction) => acc + prediction.predict, 0);
  const totalItems = predictions.length;

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableRow}>
        <Text style={styles.tableHeaderCell}>STT</Text>
        <Text style={styles.tableHeaderCell}>Tên mặt hàng</Text>
        <Text style={styles.tableHeaderCell}>Dự đoán số lượng</Text>
      </View>
      {/* Hàng tổng kết */}
      <View style={styles.summaryRow}>
        <Text style={styles.tableCell}>Tổng cộng</Text>
        <Text style={styles.tableCell}>{totalItems} mặt hàng</Text>
        <Text style={styles.tableCell}>{totalPredictedQuantity.toFixed(2)}</Text>
      </View>
      {/* Dữ liệu */}
      {predictions.map((prediction, index) => (
        <View style={styles.tableRow} key={prediction.product.id}>
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{prediction.product.productName}</Text>
          <Text style={styles.tableCell}>{prediction.predict.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

export default Table;
