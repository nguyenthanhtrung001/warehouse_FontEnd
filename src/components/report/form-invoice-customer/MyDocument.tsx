// src/components/MyDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import font

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
    backgroundColor: '#f9f9f9', // Màu nền nhẹ cho trang
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0073e6', // Xanh đậm chuyên nghiệp
    textAlign: 'center',
    backgroundColor: '#e6f0ff', // Xanh nhạt làm nổi bật header
  },
  companyInfo: {
    fontSize: 12,
    marginBottom: 8,
    color: '#0073e6', // Màu xanh đậm để đồng bộ với header
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333333', // Màu đậm cho tiêu đề hóa đơn
  },
  dateSection: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 10,
    color: '#666', // Màu xám trung bình cho ngày tháng
  },
  detailsSection: {
    marginBottom: 10,
    color: '#666',
  },
  customerSection: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9', // Viền màu xám nhạt
    borderRadius: 4,
    backgroundColor: '#f2f2f2', // Màu nền nhẹ cho vùng thông tin khách hàng
  },
  customerText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#333', // Đậm hơn một chút để làm nổi bật nội dung
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
    borderTopColor: '#d9d9d9',
    fontSize: 12,
    color: '#333',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#0073e6', // Màu xanh đậm để nhấn mạnh tổng cộng
  },
  footer: {
    fontSize: 10,
    color: '#999', // Màu xám nhạt cho footer
    textAlign: 'center',
    marginTop: 20,
  },
});

// Hàm lấy ngày hiện tại dưới dạng dd/MM/yyyy
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface MyDocumentProps {
  orderId: string | null;
  customerName: string;
  customerAddress: string;
  totalAmount: number;
  printDate: string;
  employeeId: number;
}

const MyDocument: React.FC<MyDocumentProps> = ({ orderId, customerName, customerAddress, totalAmount, printDate, employeeId }) => {
  const currentDate = getCurrentDate();

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

        {/* Mã hóa đơn và thông tin bổ sung */}
        <View style={styles.detailsSection}>
          {orderId && <Text style={styles.companyInfo}>Mã hóa đơn: DH000{orderId}</Text>}
          <Text style={styles.dateSection}>Ngày lập: {currentDate}</Text>
          <Text style={styles.dateSection}>Mã nhân viên lập hóa đơn: NV000{employeeId}</Text>
          <Text style={styles.dateSection}>Ngày đặt: {printDate}</Text>
        </View>

        {/* Thông tin khách hàng */}
        <View style={styles.customerSection}>
          <Text style={styles.customerText}>Tên khách hàng: {customerName}</Text>
          <Text style={styles.customerText}>Địa chỉ: {customerAddress}</Text>
        </View>

        {/* Bảng Dữ Liệu */}
        <View style={styles.tableContainer}>
          <Table orderId={orderId} />
        </View>

        {/* Tổng tiền
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalText}>{totalAmount.toLocaleString('vi-VN')} VND</Text>
        </View> */}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>© 2024 Công ty TNHH Kho Hàng - Tất cả các quyền được bảo lưu</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
