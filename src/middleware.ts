import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodePayload } from './utils/jwtUtils';
import { fetchUserPermissions } from './utils/api';
const defaultMenuGroups = [
  {
    name: "MENU",
    menuItems: [
      { label: "Tổng quan", route: "/dashboard", access: "overview" },
      { label: "Tổng quan", route: "/admin/dashboard-admin", access: "overview_admin" },
      { label: "Quyền và tài khoản", route: "/admin/acounts", access: "accountsmanager" }, 
      { label: "Quyền và tài khoản", route: "/admin/permissionmanagement", access: "permissionmanagement" },
      { label: "Quản lý kho", route: "/admin/warehouse", access: "manager_warehouse" },
      {
        label: "Hàng hóa",
        route: "#",
        access: "products",
        children: [
          { label: "Hàng hóa", route: "/products", access: "products_view" },
          { label: "Thiết lập giá", route: "/set-prices", access: "set_prices" },
          { label: "Kiểm kho", route: "/inventorycheckslip", access: "inventory_check" },
        ],
      },
      {
        label: "Giao dịch",
        route: "#",
        access: "transactions",
        children: [
          { label: "Nhập hàng", route: "/receipts", access: "receipts_view" },
          { label: "Trả hàng nhập", route: "/deliverynotes", access: "return_goods" },
          { label: "Xuất hủy", route: "/remove-items", access: "dispose_items" },
          { label: "Bán hàng", route: "/order", access: "order" },
          { label: "Hóa đơn", route: "/invoice", access: "invoice_view" },
          { label: "Trả hàng", route: "/order/return", access: "return_order" },
        ],
      },
      {
        label: "Vận chuyển",
        route: "#",
        access: "shipping",
        children: [
          { label: "Chuyển kho", route: "/transfer", access: "transfer" },
          { label: "Nhập kho", route: "/transfer/import", access: "import_transfer" },
        ],
      },
      {
        label: "Đối tác",
        route: "#",
        access: "partners",
        children: [
          { label: "Khách hàng", route: "/customers", access: "customers" },
          { label: "Nhà cung cấp", route: "/suppliers", access: "suppliers" },
        ],
      },
      {
        label: "Sổ quỹ",
        route: "/fund",
        access: "fund",
      },
      {
        label: "Nhân viên",
        route: "#",
        access: "employees",
        children: [
          { label: "Nhân viên", route: "/employees", access: "employees_view" },
          { label: "Lịch làm việc", route: "/workshift", access: "workshift" },
          { label: "Bảng tính lương", route: "/pay-roll", access: "payroll" },
          { label: "Thiết lập chung", route: "/settings/salary", access: "salary_settings" },
        ],
      },
      {
        label: "Báo cáo",
        route: "#",
        access: "reports",
        children: [
          { label: "Tồn kho", route: "/report/inventory", access: "report_inventory" },
          { label: "Nhập - Xuất", route: "/report/import-export", access: "report_import_export" },
          { label: "Nhập - Nhà cung cấp", route: "/report/import-supplier", access: "report_import_supplier" },
          { label: "Xu hướng mặt hàng", route: "/report/trending", access: "report_trending" },
        ],
      },
      {
        label: "Gợi ý",
        route: "#",
        access: "suggestions",
        children: [
          { label: "Xu hướng SL nhập", route: "/predict", access: "predict_trends" },
        ],
      },
    ],
  },
];


// Hàm lấy tất cả đường dẫn mà người dùng có quyền truy cập
function getAccessibleRoutes(menuGroups: any, userPermissions: string[]): string[] {
  const routes: string[] = [];

  menuGroups.forEach((group: any) => {
    group.menuItems.forEach((menuItem: any) => {
      // Kiểm tra quyền cho mục chính
      if (userPermissions.includes(menuItem.access)) {
        if (menuItem.route && menuItem.route !== "#") {
          routes.push(menuItem.route);
        }
      }

      // Kiểm tra quyền cho các mục con (nếu có)
      if (menuItem.children) {
        menuItem.children.forEach((child: any) => {
          if (userPermissions.includes(child.access)) {
            routes.push(child.route);
          }
        });
      }
    });
  });

  return routes;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('authToken')?.value;

  console.log('Đường dẫn hiện tại:', pathname);
  console.log('Token phiên hiện tại:', sessionToken);

  if (isStaticPath(pathname)) return NextResponse.next();

  if (!sessionToken) return handleUnauthenticatedAccess(pathname, request.url);

  const payload = decodePayload(sessionToken);
  if (payload && isTokenExpired(payload)) {
    return handleTokenExpired(request);
  }

  let userRole = null;
  let userPermissions = [];
  try {
    const userInfo = await fetchUserPermissions(sessionToken);
    if (userInfo) {
      userRole = userInfo.roleName;
      userPermissions = userInfo.permissions;
      console.log('Vai trò người dùng:', userRole);
      console.log('Quyền hạn người dùng:', userPermissions);
    } else {
      console.error('Lỗi khi lấy thông tin người dùng:', userInfo);
      return handleInvalidToken(request);
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return handleInvalidToken(request);
  }

  if (isAuthenticatedPath(pathname) && userRole) {
    return redirectToRoleHome(userRole, request.url);
  }

  // Tạo mảng đường dẫn tham chiếu từ `defaultMenuGroups` và `userPermissions`
  const accessibleRoutes = getAccessibleRoutes(defaultMenuGroups, userPermissions);

  // if (!accessibleRoutes.some(route => pathname.startsWith(route))) {
  //   console.log('Người dùng không có quyền truy cập, chuyển hướng đến trang không được phép');
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

function isStaticPath(pathname: string): boolean {
  return pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/images/');
}

function handleUnauthenticatedAccess(pathname: string, url: string) {
  if (pathname !== '/auth/login' && pathname !== '/register') {
    console.log('Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
    return NextResponse.redirect(new URL('/auth/login', url));
  }
  return NextResponse.next();
}

function isTokenExpired(payload: any): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp && payload.exp < currentTime;
}

function handleTokenExpired(request: NextRequest) {
  console.log('Token đã hết hạn');
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.delete('authToken');
  return response;
}

function handleInvalidToken(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.delete('authToken');
  return response;
}

function isAuthenticatedPath(pathname: string): boolean {
  return ['/auth/login', '/register'].some((path) => pathname.startsWith(path));
}

function redirectToRoleHome(userRole: string, url: string) {
  let redirectTo = '/';

  switch (userRole) {
    case 'ADMIN':
      redirectTo = '/dashboard-admin';
      break;
    case 'MANAGER':
      redirectTo = '/dashboard';
      break;
    case 'STAFF':
      redirectTo = '/unauthorized';
      break;
    case 'USER':
      redirectTo = '/inventory';
      break;
    default:
      redirectTo = '/unauthorized';
  }

  console.log('Người dùng đã đăng nhập, chuyển hướng đến trang:', redirectTo);
  return NextResponse.redirect(new URL(redirectTo, url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/|inventory).*)'],
};
