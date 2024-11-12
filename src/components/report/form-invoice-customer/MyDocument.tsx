// src/components/MyDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import font

// Định nghĩa các kiểu dáng cho hóa đơn
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto', // Đặt font chữ Roboto
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4f81bd',
    textAlign: 'center',
  },
  companyInfo: {
    fontSize: 12,
    marginBottom: 8,
    color: '#333',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  customerSection: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  customerText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
  },
  tableContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    fontSize: 12,
  },
  footer: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});

// Hàm lấy ngày giờ hiện tại
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString();
};

interface MyDocumentProps {
  orderId: string | null;
  customerName: string;
  customerAddress: string;
}

// Component hóa đơn
const MyDocument: React.FC<MyDocumentProps> = ({ orderId, customerName, customerAddress }) => {
  const currentDateTime = getCurrentDateTime();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyInfo}>Công ty TNHH Kho Hàng</Text>
          <Text style={styles.companyInfo}>Địa chỉ: 123 Đường ABC, Phường XYZ, TP. HCM</Text>
          <Text style={styles.companyInfo}>Điện thoại: 0123 456 789</Text>
        </View>

        {/* Title */}
        <Text style={styles.invoiceTitle}>HÓA ĐƠN</Text>
        <Text style={styles.companyInfo}>Ngày lập: {currentDateTime}</Text>

        {/* Mã hóa đơn */}
        {orderId && (
          <Text style={styles.companyInfo}>Mã hóa đơn: DH000{orderId}</Text>
        )}

        {/* Thông tin khách hàng */}
        <View style={styles.customerSection}>
          <Text style={styles.customerText}>Tên khách hàng: {customerName}</Text>
          <Text style={styles.customerText}>Địa chỉ: {customerAddress}</Text>
        </View>

        {/* Bảng Dữ Liệu */}
        <View style={styles.tableContainer}>
          <Table orderId={orderId} />
        </View>

        

        {/* Footer */}
        <View style={styles.footer}>
          <Text>© 2024 Công ty TNHH Kho Hàng - Tất cả các quyền được bảo lưu</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
