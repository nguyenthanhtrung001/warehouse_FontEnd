// src/components/MyDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import file đăng ký font
import { Employee } from '@/types/employee';

// Định nghĩa các màu sắc và kiểu dáng chung
const colors = {
  headerText: '#333333',
  titleBackground: '#4f81bd',
  titleText: '#ffffff',
  sectionBorder: '#cccccc',
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
  },
  dateSection: {
    fontSize: 10,
    color: colors.headerText,
    textAlign: 'right',
    marginBottom: 15,
  },
  titleSection: {
    backgroundColor: colors.titleBackground,
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.titleText,
  },
  supplierSection: {
    padding: 10,
    fontSize: 12,
    borderColor: colors.sectionBorder,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

// Hàm để lấy ngày giờ hiện tại
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString();
};

interface MyDocumentProps {
  idSupplier: number;
  nameSupplier: string;
  employee: Employee | null;
  month: number; // Thêm tháng
  year: number;  // Thêm năm
}

// Tạo một component PDFDocument để hiển thị nội dung PDF
const MyDocument: React.FC<MyDocumentProps> = ({ idSupplier, nameSupplier, employee, month, year }) => {
  const currentDateTime = getCurrentDateTime();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Ngày lập */}
        <View style={styles.dateSection}>
          <Text>Ngày lập: {currentDateTime}</Text>
        </View>

        {/* Tiêu đề */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>THỐNG KÊ NHẬP HÀNG THEO NHÀ CUNG CẤP</Text>
        </View>

        {/* Tên nhà cung cấp */}
        <View style={styles.supplierSection}>
          <Text style={styles.supplierName}>Nhà cung cấp: {nameSupplier}</Text>
          <Text>ID Nhà cung cấp: {idSupplier}</Text>
          <Text>Tháng: {month} - Năm: {year}</Text> {/* Hiển thị tháng và năm */}
        </View>

        {/* Bảng dữ liệu */}
        <Table idSupplier={idSupplier} employee={employee} month={month} year={year} />
      </Page>
    </Document>
  );
};

export default MyDocument;
