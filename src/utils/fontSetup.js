// src/utils/fontSetup.js
import { Font } from '@react-pdf/renderer';

// Đăng ký font từ thư mục public
Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf', // Đường dẫn từ thư mục public
});
