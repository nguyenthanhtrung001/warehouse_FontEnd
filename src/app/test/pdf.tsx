// pages/report.tsx
"use client"; // Đảm bảo rằng trang này chỉ chạy trên client-side

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Định nghĩa các kiểu dáng cho PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Times-Roman', // Đặt font chữ nếu cần
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
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
    textAlign: 'center',
    flex: 1,
  },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    flex: 1,
  },
});

// Tạo component bảng dữ liệu
const Table = () => (
  <View style={styles.table}>
    {/* Header */}
    <View style={styles.tableRow}>
      <Text style={styles.tableHeaderCell}>STT</Text>
      <Text style={styles.tableHeaderCell}>Tên</Text>
      <Text style={styles.tableHeaderCell}>Giá</Text>
      <Text style={styles.tableHeaderCell}>Số lượng</Text>
    </View>

    {/* Dữ liệu */}
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>1</Text>
      <Text style={styles.tableCell}>Sản phẩm A</Text>
      <Text style={styles.tableCell}>100.000 VNĐ</Text>
      <Text style={styles.tableCell}>10</Text>
    </View>
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>2</Text>
      <Text style={styles.tableCell}>Sản phẩm B</Text>
      <Text style={styles.tableCell}>200.000 VNĐ</Text>
      <Text style={styles.tableCell}>5</Text>
    </View>
  </View>
);

// Tạo một component PDFViewer để hiển thị nội dung PDF
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Báo cáo PDF của tôi</Text>
      </View>
      <View style={styles.section}>
        <Text>Nội dung báo cáo chi tiết sẽ được hiển thị ở đây NGUYEN THANH TRUNG.</Text>
      </View>
      <View style={styles.section}>
        <Text>Danh sách dữ liệu:</Text>
        <Table />
      </View>
    </Page>
  </Document>
);

// Trang chính để hiển thị PDF
const ReportPage = () => (
  <div className="flex justify-center items-center h-screen">
    <PDFViewer width="100%" height="100%">
      <MyDocument />
    </PDFViewer>
  </div>
);

export default ReportPage;
