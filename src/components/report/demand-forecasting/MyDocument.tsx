// src/components/MyDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import file đăng ký font

// Định nghĩa các kiểu dáng cho tài liệu
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto', // Đặt font chữ Roboto nếu cần
  },
  section: {
    margin: 5,
    padding: 2,
    fontSize: 12,
    fontFamily: 'Roboto', // Đặt font chữ Roboto cho các đoạn văn bản
  },
  title: {
    fontSize: 20, // Tăng kích thước chữ
    fontWeight: 'bold', // In đậm
    textAlign: 'center', // Căn giữa
    marginBottom: 12, // Khoảng cách dưới
    // color: 'red', // Đặt màu chữ đỏ
  },
});

// Hàm để lấy ngày giờ hiện tại
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString(); // Định dạng ngày giờ theo địa phương
};

// Tạo một component PDFDocument để hiển thị nội dung PDF
const MyDocument = () => {
  const currentDateTime = getCurrentDateTime();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.section}>
          <Text>Ngày lập: {currentDateTime}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>DỰ BÁO XU HƯỚNG GỢI Ý NHẬP HÀNG KHO</Text>
        </View>
        <View style={styles.section}>
          <Table />
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
