import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import font setup file
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns'; // Import format from date-fns

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  productId: number;
  nameProduct: string;
  invoiceId: {
    id: number;
    printDate: string;
    price: number;
    employeeId: number;
    status: number;
    customer: {
      id: number;
      customerName: string;
      phoneNumber: string;
      dateOfBirth: string | null;
      address: string;
      email: string;
      note: string;
    };
    note: string;
  };
  quantity: number;
  purchasePrice: number;
  note_return: string;
}

// Định nghĩa các kiểu dáng cho bảng
const styles = StyleSheet.create({
  table: {
    margin: '10px 0',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: '#3c50e0',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f0ad4e',
    paddingVertical: 5,
  },
  customerInfo: {
    marginBottom: 10,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  invoiceDate: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
});

// Định nghĩa kiểu dữ liệu cho props
interface TableProps {
  orderId: string | null;
}

// Tạo component bảng dữ liệu
const Table: React.FC<TableProps> = ({ orderId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customerInfo, setCustomerInfo] = useState<{
    customerName: string;
    phoneNumber: string;
    address: string;
    email: string;
  }>({
    customerName: '',
    phoneNumber: '',
    address: '',
    email: '',
  });
  const [invoiceDate, setInvoiceDate] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (orderId) {
        try {
          const response = await axiosInstance.get<Product[]>(`http://localhost:8888/v1/api/invoice-details/invoice/${orderId}`);
          const data = response.data;
          setProducts(data);

          if (data.length > 0) {
            const customer = data[0].invoiceId.customer;
            setCustomerInfo({
              customerName: customer.customerName,
              phoneNumber: customer.phoneNumber,
              address: customer.address,
              email: customer.email,
            });

            const formattedDate = format(new Date(data[0].invoiceId.printDate), "HH:mm:ss dd-MM-yyyy");
            setInvoiceDate(formattedDate);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchProducts();
  }, [orderId]);

  const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalPrice = products.reduce((acc, product) => acc + (product.quantity * product.purchasePrice), 0);
  const totalItems = products.length;

  return (
    <View>
      <Text style={styles.invoiceDate}>Ngày đặt: {invoiceDate}</Text>

      <Text style={styles.customerInfo}>Tên khách hàng: {customerInfo.customerName}</Text>
      <Text style={styles.customerInfo}>Số điện thoại: {customerInfo.phoneNumber}</Text>
      <Text style={styles.customerInfo}>Địa chỉ: {customerInfo.address}</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <Text style={styles.tableHeaderCell}>STT</Text>
          <Text style={styles.tableHeaderCell}>Tên mặt hàng</Text>
          <Text style={styles.tableHeaderCell}>Số lượng</Text>
          <Text style={styles.tableHeaderCell}>Giá</Text>
          <Text style={styles.tableHeaderCell}>Thành tiền</Text>
        </View>

        {/* Dữ liệu sản phẩm */}
        {products.map((product, index) => (
          <View style={styles.tableRow} key={product.id}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{product.nameProduct}</Text>
            <Text style={styles.tableCell}>{product.quantity}</Text>
            <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice * product.quantity)}</Text>
          </View>
        ))}

        {/* Hàng tổng kết */}
        <View style={styles.summaryRow}>
          <Text style={styles.tableCell}>Tổng cộng</Text>
          <Text style={styles.tableCell}>{totalItems} mặt hàng</Text>
          <Text style={styles.tableCell}>{totalQuantity}</Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}>{formatCurrency(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

export default Table;
