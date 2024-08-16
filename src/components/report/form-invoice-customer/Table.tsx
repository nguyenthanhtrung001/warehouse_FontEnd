import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import '@/utils/fontSetup'; // Import file đăng ký font
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns'; // Import format từ date-fns

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  productId: number;
  nameProduct: string;
  invoiceId: {
    id: number;
    printDate: string; // Ngày lập hóa đơn
    price: number;
    employeeId: number;
    status: number;
    customer: {
      id: number;
      customerName: string;
      phoneNumber: string;
      dateOfBirth: string | null;
      address: string;
      email: string; // Thêm trường email
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
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
    textAlign: 'center',
    flex: 1,
  },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    fontSize: 12,
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
    fontWeight: 'bold',
    backgroundColor: '#3c50e0', // Màu nền xanh dương cho header
    color: '#ffffff', // Màu chữ trắng cho header
    textAlign: 'center',
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f0ad4e', // Màu nền cho hàng tổng kết
  },
  customerInfo: {
    marginBottom: 10,
    fontSize: 12,
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
  },
  invoiceDate: {
    fontSize: 12,
    fontFamily: 'Roboto', // Sử dụng font đã đăng ký
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
    email: string; // Thêm email vào state
  }>({
    customerName: '',
    phoneNumber: '',
    address: '',
    email: '', // Khởi tạo email
  });
  const [invoiceDate, setInvoiceDate] = useState<string>(''); // Thêm state cho ngày lập hóa đơn

  useEffect(() => {
    const fetchProducts = async () => {
      if (orderId) {
        try {
          const response = await axiosInstance.get<Product[]>(`http://localhost:8888/v1/api/invoice-details/invoice/${orderId}`);
          const data = response.data;
          setProducts(data);

          // Trích xuất thông tin khách hàng từ sản phẩm đầu tiên (giả sử tất cả sản phẩm đều thuộc cùng một khách hàng)
          if (data.length > 0) {
            const customer = data[0].invoiceId.customer;
            setCustomerInfo({
              customerName: customer.customerName,
              phoneNumber: customer.phoneNumber,
              address: customer.address,
              email: customer.email, // Lưu email vào state
            });

            // Định dạng ngày lập hóa đơn và lưu vào state
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

  // Tính tổng số lượng và tổng giá trị
  const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalPrice = products.reduce((acc, product) => acc + (product.quantity * product.purchasePrice), 0);
  const totalItems = products.length;

  return (
    <View>
      {/* Ngày lập hóa đơn */}
      <Text style={styles.invoiceDate}>Ngày đặt: {invoiceDate}</Text> {/* Hiển thị ngày lập hóa đơn */}

      {/* Thông tin khách hàng */}
      <Text style={styles.customerInfo}>Tên khách hàng: {customerInfo.customerName}</Text>
      <Text style={styles.customerInfo}>Số điện thoại: {customerInfo.phoneNumber}</Text>
      <Text style={styles.customerInfo}>Địa chỉ: {customerInfo.address}</Text>
      {/* <Text style={styles.customerInfo}>Email: {customerInfo.email}</Text> Hiển thị email */}
      
      
      {/* Bảng sản phẩm */}
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <Text style={styles.tableHeaderCell}>STT</Text>
          <Text style={styles.tableHeaderCell}>Tên mặt hàng</Text>
          <Text style={styles.tableHeaderCell}>Số lượng</Text>
          <Text style={styles.tableHeaderCell}>Giá</Text>
          <Text style={styles.tableHeaderCell}>Thành tiền</Text>
        </View>
        {/* Hàng tổng kết */}
        <View style={styles.summaryRow}>
          <Text style={styles.tableCell}>Tổng cộng</Text>
          <Text style={styles.tableCell}>{totalItems} mặt hàng</Text>
          <Text style={styles.tableCell}>{totalQuantity}</Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}>{formatCurrency(totalPrice)}</Text>
        </View>
        {/* Dữ liệu */}
        {products.map((product, index) => (
          <View style={styles.tableRow} key={product.id}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{product.nameProduct}</Text>
            <Text style={styles.tableCell}>{product.quantity}</Text>
            <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(product.purchasePrice * product.quantity)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Table;
