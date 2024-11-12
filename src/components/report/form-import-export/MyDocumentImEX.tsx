// components/report/MyDocumentImEX.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import file đăng ký font
import { Employee } from '@/types/employee'; // Import kiểu Employee

const colors = {
  headerBackground: '#4f81bd',
  headerText: '#ffffff',
  titleBackground: '#d9e1f2',
  titleText: '#333333',
  dateRangeText: '#555555',
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
  },
  header: {
    backgroundColor: colors.headerBackground,
    color: colors.headerText,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    flexDirection: 'column',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 10,
    color: colors.headerText,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  section: {
    margin: 5,
    padding: 2,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.titleText,
    backgroundColor: colors.titleBackground,
    textAlign: 'center',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  dateRange: {
    fontSize: 12,
    color: colors.dateRangeText,
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
    color: '#777777',
  },
});

interface MyDocumentProps {
  month: number;
  year: number;
  employee: Employee | null;
}

const MyDocument: React.FC<MyDocumentProps> = ({ month, year, employee }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const getMonthStartAndEnd = (month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB');
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const currentDateTime = getCurrentDateTime();
  const { startDate, endDate } = getMonthStartAndEnd(month, year);

  return (
    <Document>
      <Page size={{ width: 842, height: 595 }} style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerText}>Ngày lập: {currentDateTime}</Text>
            <Text style={styles.headerText}>
            Mã kho: {employee?.warehouseId ? `KH000${employee.warehouseId}` : 'Không xác định'}
          </Text>
            </View>
         
          <Text style={styles.headerText}>Nhân viên: {employee?.employeeName || 'Không xác định'}</Text>
         
          <Text style={styles.companyName}> WAREHOUSE</Text>
        </View>
        
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>BÁO CÁO CHI TIẾT NHẬP - XUẤT KHO</Text>
          <Text style={styles.dateRange}>Từ ngày {startDate} đến ngày {endDate}</Text>
        </View>

        {/* Table */}
        <View style={styles.section}>
          <Table month={month} year={year} employee={employee} />
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>© 2024 Công ty TNHH Thanh Trung - Báo cáo chi tiết nhập xuất kho</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
