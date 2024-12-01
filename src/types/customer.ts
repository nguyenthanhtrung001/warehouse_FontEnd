// // src/types/customer.ts

// export interface Customer {
//     detailedAddress: any;
//     addressId: number | undefined;
//     id: number; // Nếu id là số
//     customerName: string;
//     phoneNumber: string;
//     dateOfBirth: string; // Dùng kiểu string cho ngày sinh (hoặc có thể dùng Date nếu cần)
//     address: string;
//     email: string;
//     note: string;
//   }
  
// Kiểu Customer với đầy đủ thuộc tính
export interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  email: string;
  detailedAddress: string;
  addressId?: number;
  dateOfBirth?: string;
  address?: string;
  note?: string;
}
