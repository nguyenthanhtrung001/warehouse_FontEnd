// src/components/Table.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance';
import '@/utils/fontSetup';
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns';

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

const styles = StyleSheet.create({
  table: {
    margin: '10px 0',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: '#f9f9f9', // Nền xám nhạt cho hàng dữ liệu
  },
  tableCell: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    flex: 1,
    paddingVertical: 5,
    color: '#333', // Màu chữ đậm cho nội dung
  },
  tableHeaderCell: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: '#1e3a8a', // Màu xanh đậm cho tiêu đề
    color: '#ffffff', // Màu trắng cho chữ tiêu đề
    textAlign: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#2f855a', // Màu xanh lá đậm cho hàng tổng cộng
    paddingVertical: 5,
  },
  summaryCell: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    flex: 1,
    color: '#ffffff', // Màu trắng cho chữ trong hàng tổng cộng
  },
  customerInfo: {
    marginBottom: 10,
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#333', // Màu đậm cho thông tin khách hàng
  },
  invoiceDate: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#555', // Màu xám trung bình cho ngày hóa đơn
    marginBottom: 10,
  },
});

interface TableProps {
  orderId: string | null;
}

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
          <Text style={styles.summaryCell}>Tổng cộng</Text>
          <Text style={styles.summaryCell}>{totalItems} mặt hàng</Text>
          <Text style={styles.summaryCell}>{totalQuantity}</Text>
          <Text style={styles.summaryCell}></Text>
          <Text style={styles.summaryCell}>{formatCurrency(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

export default Table;
