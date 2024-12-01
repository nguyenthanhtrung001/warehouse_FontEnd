// src/utils/api.ts

import axiosInstance from './axiosInstance';
import API_ROUTES from './apiRoutes';
import { useEmployeeStore } from '@/stores/employeeStore'; // Nhập store mới
import { useCustomerStore } from '@/stores/customerStore'; // Nhập store mới
import { Employee } from '@/types/employee';
import { Customer } from '@/types/customer';
import { notification } from 'antd';
import { ForecastAPIResponse, ItemForecast, ForecastResult } from '@/types/predict';
import axios from 'axios';



export async function fetchUserInfo(sessionToken: string) {
  try {
    const res = await axiosInstance.get('http://localhost:8888/v1/identity/users/my-info', {
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

export async function fetchUserPermissions(sessionToken: string) {
  try {
    const res = await axiosInstance.get('http://localhost:8888/v1/identity/users/my-info', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const data = res.data;
    if (data.code === 1000) {
      const roleName = data.result.roles[0].name; // Lấy tên vai trò
      const permissions = data.result.roles[0].permissions.map((perm: any) => perm.name); // Lấy danh sách tên quyền

      return { roleName, permissions }; // Trả về cả roleName và danh sách permissions
    } else {
      console.error('Error fetching user info:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
// Lấy thông tin đăng nhập khách hàng
export async function fetchCustomerByAccountId(email: string): Promise<Customer | null> {
  try {
    const res = await axiosInstance.get(API_ROUTES.CUSTOMER_DETAILS_BY_EMAIL(email));  // API route dành cho Customer
    const data: Customer = res.data;

    if (data) {
      // Lưu thông tin khách hàng vào Zustand
      useCustomerStore.getState().setCustomer(data);

      console.log('Customer data retrieved from API:', data);
      return data;
    } else {
      console.error('Error fetching customer data:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}


// lấy thông tin đăng nhập nhan vien
export async function fetchEmployeeByAccountId(accountId: string): Promise<Employee | null> {
  try {
    const res = await axiosInstance.get(API_ROUTES.EMPLOYEE_BY_ACCOUNT_ID(accountId));
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
    const res = await axiosInstance.get('http://localhost:8888/v1/identity/users/my-info');

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

export const fetchLowestProducts = async (quantity:number, warehouseId:number) => {
  if (!warehouseId) {
    throw new Error('warehouseId is required');
  }

  try {
    const response = await axiosInstance.get(`http://localhost:8888/v1/api/products/notify-lowest`, {
      params: {
        quantity: quantity,
        warehouseId: warehouseId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


export const fetchForecastData = async (): Promise<{
  itemForecasts: ItemForecast[];
  forecastResults: ForecastResult[];
}> => {
  try {
    const response = await axiosInstance.get<ForecastAPIResponse>('http://localhost:8888/v1/api/bigquery/forecast/result?warehouseId=3');

    const { itemForecastTotal, forecastResults } = response.data;

    // Kiểm tra dữ liệu trả về
    if (!itemForecastTotal || !forecastResults) {
      console.error('Dữ liệu trả về từ API không hợp lệ:', response.data);
      throw new Error('Dữ liệu API không đầy đủ hoặc sai cấu trúc.');
    }

    // Chuyển đổi itemForecastTotal thành mảng
    const itemForecasts: ItemForecast[] = Object.values(itemForecastTotal);

    // Xử lý dữ liệu forecastResults
    const processedForecastResults: ForecastResult[] = forecastResults.map((result) => {
      const {
        forecastValue,
        standardError,
        confidenceIntervalLowerBound,
        confidenceIntervalUpperBound,
      } = result;
    
      return {
        ...result,
        forecastValue: typeof forecastValue === 'string' ? parseFloat(forecastValue) : forecastValue,
        standardError: typeof standardError === 'string' ? parseFloat(standardError) : standardError,
        confidenceIntervalLowerBound:
          typeof confidenceIntervalLowerBound === 'string'
            ? parseFloat(confidenceIntervalLowerBound)
            : confidenceIntervalLowerBound,
        confidenceIntervalUpperBound:
          typeof confidenceIntervalUpperBound === 'string'
            ? parseFloat(confidenceIntervalUpperBound)
            : confidenceIntervalUpperBound,
      };
    });
    
    return { itemForecasts, forecastResults: processedForecastResults };
  } catch (error: any) {
    // Xử lý lỗi và log thêm chi tiết
    console.error('Lỗi khi gọi API fetchForecastData:', error.message || error);

    if (axios.isAxiosError(error)) {
      console.error('Chi tiết lỗi Axios:', error.response?.data || error.message);
    }

    return { itemForecasts: [], forecastResults: [] };
  }
};

// Hàm để train lại mô hình
export const trainModel = async (): Promise<void> => {
  try {
    await axiosInstance.post('http://localhost:8888/v1/api/bigquery/train');
    notification.success({
      message: 'Train mô hình thành công',
      description: 'Mô hình đã được train lại thành công!',
    });
  } catch (error: unknown) {
    handleApiError(error, 'Lỗi khi train mô hình');
  }
};

// Hàm xử lý lỗi từ API
const handleApiError = (error: unknown, defaultMessage: string): void => {
  if (error instanceof Error) {
    notification.error({
      message: defaultMessage,
      description: error.message,
    });
  } else {
    notification.error({
      message: defaultMessage,
      description: 'Đã xảy ra lỗi không xác định.',
    });
  }
};

