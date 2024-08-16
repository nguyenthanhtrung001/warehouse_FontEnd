// src/stores/employeeStore.ts

import { create } from 'zustand';
import { Employee } from '../types/employee';

interface EmployeeState {
  employee: Employee | null;
  setEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  setEmployee: (employee) => set({ employee }),
}));

// Khởi tạo trạng thái từ localStorage nếu có
export const initializeEmployeeFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      useEmployeeStore.getState().setEmployee(JSON.parse(storedEmployee));
    }
  }
};
