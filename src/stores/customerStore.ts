// src/stores/customerStore.ts

import { create } from 'zustand';
import { Customer } from '../types/customer';
import { encrypt, decrypt } from '../utils/cryptoUtils'; // Nhập các hàm từ cryptoUtils

interface CustomerState {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
}

// Tạo store Zustand
export const useCustomerStore = create<CustomerState>((set) => ({
  customer: null,
  setCustomer: (customer) => {
    // Mã hóa dữ liệu trước khi lưu vào localStorage
    const encryptedData = encrypt(JSON.stringify(customer));
    console.log("Encrypted Customer Data:", encryptedData); // Xuất giá trị mã hóa ra console
    localStorage.setItem('customer', encryptedData);
    set({ customer });
  },
}));

// Khởi tạo trạng thái từ localStorage nếu có
export const initializeCustomerFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const storedCustomer = localStorage.getItem('customer');
    console.log("Stored Customer in Local Storage:", storedCustomer); // Log giá trị lưu trữ
    if (storedCustomer) {
      try {
        // Giải mã dữ liệu từ localStorage
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer));
        console.log("Decrypted Customer Data:", decryptedCustomer); // Xuất giá trị giải mã ra console
        useCustomerStore.getState().setCustomer(decryptedCustomer);
      } catch (error) {
        console.error("Failed to decrypt customer data:", error);
      }
    }
  }
};
