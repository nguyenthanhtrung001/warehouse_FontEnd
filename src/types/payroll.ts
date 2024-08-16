// src/types/payroll.ts

export interface Employee {
    id: number;
    employeeName: string;
    basicSalary: number;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
    image: string;
    dateJoined: string;
    position: string;
    address: string;
    email: string;
    account_id: number | null;
    status: number;
  }
  
  export interface Payroll {
    id: number;
    namePayroll: string;
    workingPeriod: string;
    workingDays: number;
    bonus: number;
    totalIncome: number;
    deduction: number;
    totalSalary: number;
    status: number;
    employee: Employee; // Thêm thuộc tính employee, mặc dù không hiển thị trong bảng lương
    count: number;
    totalSalarySum:number;
    note:string;
    working_period:string;
  }
  