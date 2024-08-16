// src/utils/formatCurrency.ts

/**
 * Định dạng số thành tiền tệ Việt Nam (VND)
 * @param amount - Số cần định dạng
 * @returns - Chuỗi định dạng tiền tệ
 */
export const formatCurrency = (amount: number): string => {
    // Chuyển số thành chuỗi và định dạng với dấu phân cách hàng nghìn
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // Không hiển thị số thập phân
    });
  };
  