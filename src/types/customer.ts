// src/types/customer.ts

export interface Customer {
    id: number; // Nếu id là số
    customerName: string;
    phoneNumber: string;
    dateOfBirth: string; // Dùng kiểu string cho ngày sinh (hoặc có thể dùng Date nếu cần)
    address: string;
    email: string;
    note: string;
  }
  