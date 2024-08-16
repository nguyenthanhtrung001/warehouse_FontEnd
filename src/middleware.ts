import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodePayload } from './utils/jwtUtils';
import { fetchUserInfo } from './utils/api';
import Cookies from "js-cookie";

const roleBasedPaths: { [key: string]: string[] } = {
  USER: [ '/products','/inventorycheckslip','/order','/invoice','/invoice/return','/receipts','/deliverynotes','/remove-Items','/customers' ],
  ADMIN: ['/'], // ADMIN có quyền truy cập tất cả các đường dẫn
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('authToken')?.value;

  console.log('Đường dẫn hiện tại:', pathname);
  console.log('Token phiên hiện tại:', sessionToken);

  let userRole = null;

  // Cho phép truy cập các tệp tĩnh trong thư mục _next/ và favicon.ico
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/images/')) {
    console.log('Truy cập vào tệp tĩnh hoặc hình ảnh.');
    return NextResponse.next();
  }

  // Nếu không có token và truy cập vào đường dẫn khác, yêu cầu đăng nhập
  if (!sessionToken) {
    if (pathname !== '/auth/login' && pathname !== '/register') {
      console.log('Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Nếu có token, kiểm tra tính hợp lệ của nó
  const payload = decodePayload(sessionToken);
  console.log('Payload giải mã:', payload);

  if (payload) {
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('Thời gian hiện tại:', currentTime);

    if (payload.exp && payload.exp < currentTime) {
      console.log('Token đã hết hạn');
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }

    // Gọi hàm lấy quyền từ API
    try {
      userRole = await fetchUserInfo(sessionToken);
      console.log('Vai trò người dùng:', userRole);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      Cookies.remove("authToken");
      return response;
    }
  }

  // Chuyển hướng người dùng đã đăng nhập ra khỏi các đường dẫn xác thực
  if (['/auth/login', '/register'].some((path) => pathname.startsWith(path)) && sessionToken && userRole) {
    const redirectTo = userRole === 'USER' ? '/' : '/doashboard'; // Cập nhật nếu cần
    console.log('Người dùng đã đăng nhập, chuyển hướng đến trang:', redirectTo);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Kiểm tra quyền truy cập vào các đường dẫn
  if (pathname.startsWith('/employees') 
    || pathname.startsWith('/customers')
    || pathname.startsWith('/doashboard')
    || pathname.startsWith('/admin') || pathname.startsWith('/set-prices') 
    || pathname.startsWith('/workshift') || pathname.startsWith('/pay-roll') 
    || pathname.startsWith('/settings/salary') || pathname.startsWith('/report') 
    || pathname.startsWith('/suppliers')) {

    if (!sessionToken || !userRole) {
      console.log('Chưa có token hoặc vai trò người dùng, chuyển hướng đến trang đăng nhập');
      Cookies.remove("authToken");
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Kiểm tra quyền của người dùng cho đường dẫn
    const allowedPaths = roleBasedPaths[userRole] || [];
    console.log('Các đường dẫn được phép:', allowedPaths);

    if (!allowedPaths.some((path) => pathname.startsWith(path))) {
      console.log('Người dùng không có quyền truy cập, chuyển hướng đến trang không được phép');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/).*)'], // Bỏ qua các đường dẫn của API, Next.js static files, favicon và public images
};
