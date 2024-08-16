// src/utils/jwtUtils.ts

import jwt from 'jsonwebtoken';

// Định nghĩa cấu trúc của payload giải mã
interface DecodedPayload {
  iss?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  scope?: string;
}

// Hàm giải mã token mà không xác thực chữ ký
export const decodePayload = (token: string | undefined): DecodedPayload | null => {
  if (!token) {
    console.error('Token không hợp lệ');
    return null;
  }

  try {
    // Giải mã token mà không xác thực chữ ký
    const decoded = jwt.decode(token) as DecodedPayload;
    
    if (!decoded) {
      console.error('Không thể giải mã token');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    return null;
  }
};
