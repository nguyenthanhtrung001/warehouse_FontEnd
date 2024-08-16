// utils/cryptoUtils.ts

import CryptoJS from "crypto-js";

const secretKey = "fKRJjVchHFHqkERVZxaVEYtXtg9kPOta"; // Thay đổi khóa bí mật này

// Hàm mã hóa
export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Hàm giải mã
export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
