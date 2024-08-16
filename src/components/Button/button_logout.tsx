import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEmployeeStore } from "@/stores/employeeStore"; // Đảm bảo đường dẫn chính xác

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const setEmployee = useEmployeeStore((state) => state.setEmployee);


  const handleLogout = () => {
    router.push("/auth/login");
    // Xóa token khỏi cookie
    Cookies.remove("authToken");
     // Xóa dữ liệu nhân viên từ store
     setEmployee(null);
     
     if (typeof window !== 'undefined') {
      localStorage.removeItem('employee');
    }
    // Điều hướng đến trang đăng nhập
   
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
    >
      Đăng Xuất
    </button>
  );
};

export default LogoutButton;
