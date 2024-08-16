// Định nghĩa interface cho dữ liệu khách hàng
interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  email: string;
  note: string;
}

// Định nghĩa type cho dữ liệu hóa đơn
export type Invoice = {
  id: number;
  printDate: string;
  price: number;
  employeeId: number;
  status: number;
  customer: Customer;
  note: string | null;
};
