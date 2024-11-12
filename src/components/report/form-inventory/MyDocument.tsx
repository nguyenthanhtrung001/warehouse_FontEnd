// src/components/MyDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import file đăng ký font
import { Employee } from '@/types/employee'; // Import kiểu Employee

// Định nghĩa các màu sắc và kiểu dáng chung
const colors = {
  headerBackground: '#4f81bd',
  headerText: '#ffffff',
  titleText: '#333333',
  footerText: '#555555',
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.headerBackground,
    padding: 10,
    color: colors.headerText,
    marginBottom: 15,
  },
  headerTextLeft: {
    flex: 1,
    fontSize: 10,
    color: colors.headerText,
    textAlign: 'left',
    lineHeight: 1.5,
  },
  headerCompanyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.headerText,
    textAlign: 'right',
  },
  section: {
    margin: 5,
    padding: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.titleText,
    marginBottom: 15,
  },
  footer: {
    fontSize: 10,
    color: colors.footerText,
    textAlign: 'center',
    marginTop: 20,
  },
});

// Hàm để lấy ngày giờ hiện tại
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString();
};

// Component tài liệu PDF
interface MyDocumentProps {
  employee: Employee | null;
}

const MyDocument = ({ employee }: MyDocumentProps) => {
  const currentDateTime = getCurrentDateTime();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextLeft}>
            <Text>Ngày lập: {currentDateTime}</Text>
            <Text>Nhân viên: {employee?.employeeName || 'Không xác định'}</Text>
          </View>
          <Text style={styles.headerCompanyName}>WAREHOUSE</Text>
        </View>
        
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>BÁO CÁO TỒN KHO</Text>
        </View>
        
        {/* Bảng Dữ Liệu */}
        <View style={styles.section}>
          <Table employee={employee} />
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>© 2024 Công ty TNHH Thanh Trung - Tất cả các quyền được bảo lưu</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
