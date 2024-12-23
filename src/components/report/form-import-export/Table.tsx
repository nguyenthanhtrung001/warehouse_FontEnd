// components/report/Table.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import file đăng ký font
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes
import { Employee } from '@/types/employee'; // Import kiểu Employee

interface ReportImportExport {
  id: number;
  nameProduct: string | null;
  import_supplier: number;
  import_check_inventory: number;
  import_return_order: number;
  import_transfer: number;
  transfer: number;
  export_order: number;
  export_cancel: number;
  export_supplier: number;
  export_check: number;
  inventory: number;
}

const colors = {
  headerBackground: '#9ad9ff',
  headerText: '#000000',
  summaryBackground: '#ffdeb0',
  cellBorder: '#000000',
  cellText: '#000000',
};

const styles = StyleSheet.create({
  table: {
    margin: '10px 0',
    borderWidth: 1,
    borderColor: colors.cellBorder,
    borderStyle: 'solid',
    borderRadius: 4,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: colors.cellBorder,
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: colors.cellText,
  },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: colors.cellBorder,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: colors.headerBackground,
    color: colors.headerText,
    textAlign: 'center',
  },
  tableHeaderCell3: {
    borderStyle: 'solid',
    borderColor: colors.cellBorder,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: '#ffe0b4',
    color: colors.headerText,
    textAlign: 'center',
  },
  tableHeaderCell4: {
    borderStyle: 'solid',
    borderColor: colors.cellBorder,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: '#abff82',
    color: colors.headerText,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: colors.summaryBackground,
    borderTopWidth: 1,
    borderTopColor: colors.cellBorder,
  },
});

const cellFlexH = {
  stt: 0.5,
  id: 1,
  nameProduct: 2,
  import: 4, // Tổng chiều rộng cho cột "NHẬP"
  export: 5, // Tổng chiều rộng cho cột "XUẤT"
  inventory: 1,
};

const cellFlex = {
  stt: 0.5,
  id: 1,
  nameProduct: 2,
  import_supplier: 1,
  import_check_inventory: 1,
  import_return_order: 1,
  import_transfer: 1,
  export_order: 1,
  export_cancel: 1,
  export_supplier: 1,
  export_check: 1,
  transfer: 1,
  inventory: 1,
};

interface TableProps {
  month: number;
  year: number;
  employee: Employee | null;
}

const Table: React.FC<TableProps> = ({ month, year, employee }) => {
  const [data, setData] = useState<ReportImportExport[]>([]);
  const [loading, setLoading] = useState(true);


 

  
  useEffect(() => {
    const fetchData = async () => {
      if (!employee || !employee.warehouseId) return;
      try {
        const warehouseId = employee?.warehouseId;
        const url = API_ROUTES.REPORT_IMPORT_EXPORT(year, month, warehouseId);
        const response = await axiosInstance.get<ReportImportExport[]>(url);
        setData(response.data);

        setTimeout(() => { // Giả lập khoảng thời gian chờ
          setData(response.data);
          setLoading(false); // Dữ liệu đã sẵn sàng, kết thúc trạng thái loading
        }, 1000); // Thời gian chờ 1 giây
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [month, year, employee]);

  // Tính tổng các giá trị cho các cột
  const totalQuantity = data.reduce((acc, item) => acc + item.inventory, 0);
  const totalImportSupplier = data.reduce((acc, item) => acc + item.import_supplier, 0);
  const totalImportCheckInventory = data.reduce((acc, item) => acc + item.import_check_inventory, 0);
  const totalImportReturnOrder = data.reduce((acc, item) => acc + item.import_return_order, 0);
  const totalImportTransfer = data.reduce((acc, item) => acc + (item.import_transfer || 0), 0);
  const totalExportOrder = data.reduce((acc, item) => acc + item.export_order, 0);
  const totalExportCancel = data.reduce((acc, item) => acc + item.export_cancel, 0);
  const totalExportSupplier = data.reduce((acc, item) => acc + item.export_supplier, 0);
  const totalExportCheck = Math.abs(data.reduce((acc, item) => acc + item.export_check, 0));
  const totalTransfer = data.reduce((acc, item) => acc + item.transfer, 0);

  return (
    <View style={styles.table}>
      {/* Header Row */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableHeaderCell, { flex: cellFlexH.stt }]}>STT</Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlexH.id }]}>Mã hàng</Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlexH.nameProduct }]}>Tên hàng</Text>
        <Text style={[styles.tableHeaderCell3, { flex: cellFlexH.import }]}>NHẬP</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlexH.export }]}>XUẤT</Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlexH.inventory }]}>Biến động</Text>
      </View>
      {/* Sub-Header Row */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableHeaderCell, { flex: cellFlex.stt }]}></Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlex.id }]}></Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlex.nameProduct }]}></Text>
        <Text style={[styles.tableHeaderCell3, { flex: cellFlex.import_supplier }]}>NCC</Text>
        <Text style={[styles.tableHeaderCell3, { flex: cellFlex.import_check_inventory }]}>Kiểm kho</Text>
        <Text style={[styles.tableHeaderCell3, { flex: cellFlex.import_return_order }]}>Trả</Text>
        <Text style={[styles.tableHeaderCell3, { flex: cellFlex.import_transfer }]}>Chuyển</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlex.export_order }]}>Bán</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlex.export_cancel }]}>Hủy</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlex.export_supplier }]}>NCC</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlex.export_check }]}>Kiểm kho</Text>
        <Text style={[styles.tableHeaderCell4, { flex: cellFlex.transfer }]}>Chuyển</Text>
        <Text style={[styles.tableHeaderCell, { flex: cellFlex.inventory }]}>Biến động</Text>
      </View>
      {/* Data Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={item.id}>
          <Text style={[styles.tableCell, { flex: cellFlex.stt }]}>{index + 1}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.id }]}>MH{item.id}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.nameProduct }]}>{item.nameProduct || 'Chưa có tên'}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.import_supplier }]}>{item.import_supplier}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.import_check_inventory }]}>{item.import_check_inventory}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.import_return_order }]}>{item.import_return_order}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.import_transfer }]}>{item.import_transfer}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.export_order }]}>{item.export_order}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.export_cancel }]}>{item.export_cancel}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.export_supplier }]}>{item.export_supplier}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.export_check }]}>{Math.abs(item.export_check)}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.transfer }]}>{Math.abs(item.transfer)}</Text>
          <Text style={[styles.tableCell, { flex: cellFlex.inventory }]}>  {item.inventory > 0 ? `+${item.inventory}` : item.inventory}</Text>
        </View>
      ))}
      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <Text style={[styles.tableCell, { flex: cellFlex.stt }]}>Tổng</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.id }]}>-</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.nameProduct }]}>-</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.import_supplier }]}>{totalImportSupplier}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.import_check_inventory }]}>{totalImportCheckInventory}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.import_return_order }]}>{totalImportReturnOrder}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.import_transfer }]}>{totalImportTransfer}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.export_order }]}>{totalExportOrder}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.export_cancel }]}>{totalExportCancel}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.export_supplier }]}>{totalExportSupplier}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.export_check }]}>{totalExportCheck}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.transfer }]}>{totalTransfer}</Text>
        <Text style={[styles.tableCell, { flex: cellFlex.inventory }]}>{totalQuantity}</Text>
      </View>
    </View>
  );
};

export default Table;
