// components/report/MyDocumentImEX.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Table from './Table';
import '@/utils/fontSetup'; // Import file đăng ký font

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
  },
  section: {
    margin: 5,
    padding: 2,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  dateRange: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
});

interface MyDocumentProps {
  month: number;
  year: number;
}

const MyDocument: React.FC<MyDocumentProps> = ({ month, year }) => {
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
        <View style={styles.section}>
          <Text>Ngày lập: {currentDateTime}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>BÁO CÁO CHI TIẾT NHẬP - XUẤT KHO</Text>
          <Text style={styles.dateRange}>Từ ngày {startDate} đến ngày {endDate}</Text>
        </View>
        <View style={styles.section}>
        <Table month={month} year={year} />
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
