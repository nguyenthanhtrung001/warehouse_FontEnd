// src/utils/api.ts

import axios from './axiosInstance';
import API_ROUTES from './apiRoutes';
import { useEmployeeStore } from '@/stores/employeeStore'; // Nhập store mới
import { Employee } from '@/types/employee';



export async function fetchUserInfo(sessionToken: string) {
  try {
    const res = await axios.get('http://localhost:8888/v1/identity/users/my-info', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const data = res.data;
    if (data.code === 1000) {
      const roleName = data.result.roles[0].name;

     

      return roleName;
    } else {
      console.error('Error fetching user info:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
// lấy thông tin đăng nhập
export async function fetchEmployeeByAccountId(accountId: string): Promise<Employee | null> {
  try {
    const res = await axios.get(API_ROUTES.EMPLOYEE_BY_ACCOUNT_ID(accountId));
    const data: Employee = res.data;

    if (data) {
      // Lưu thông tin nhân viên vào Zustand
      useEmployeeStore.getState().setEmployee(data);

      // Lưu thông tin nhân viên vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('employee', JSON.stringify(data));
      }

      console.log('Employee data retrieved from API:', data);
      return data;
    } else {
      console.error('Error fetching employee data:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return null;
  }
}

export async function fetchUserName() {
  try {
    const res = await axios.get('http://localhost:8888/v1/identity/users/my-info');

    const data = res.data;
    if (data.code === 1000) {
      const userName = data.result.username;
      return userName;
    } else {
      console.error('Error fetching user info:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

export const fetchLowestProducts = async () => {
  try {
    const response = await axios.get(`http://localhost:8888/v1/api/products/notify-lowest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};