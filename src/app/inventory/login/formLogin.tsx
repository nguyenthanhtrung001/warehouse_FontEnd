"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/LoginLayout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchUserInfo, fetchUserName, fetchCustomerByAccountId } from '@/utils/api';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link'; // Import Link từ next/link

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userName = useUserStore(state => state.userName);
  const userExists = !!userName;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    console.log("Dữ liệu gửi đi:", {
      username,
      password,
    });

    try {
      const response = await fetch("http://localhost:8888/v1/identity/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Token:", data.result.token);
        Cookies.set("authToken", data.result.token, { path: "/" });

        const userRole = await fetchUserInfo(data.result.token);
        const userName = await fetchUserName();

        if (userRole) {
          if (userRole === 'USER') {
            router.push("/inventory");
            
          } 
          
        }

        const customer = await fetchCustomerByAccountId(userName);
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div
        className="flex justify-center items-center py-20"
        style={{
          backgroundImage: "url('/images/logo/Login_green.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="w-4/5 max-w-md px-4 py-10 bg-white rounded-xl shadow-lg border border-stroke bg-transparent">
          <span className="mb-1.5 block font-medium">Cửa hàng </span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
            ĐĂNG NHẬP
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Tài khoản
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tài khoản"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            {error && <div className="mb-4 text-red">{error}</div>}

            <div className="mb-5">
              <input
                type="submit"
                value={loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                disabled={loading}
                className="w-full cursor-pointer rounded-lg border border-primary bg-green-700 p-4 text-white transition hover:bg-green-500" // Đổi màu nút ở đây
              />
            </div>
          </form>

          <div className="mt-4 text-center">
            <p>
              Chưa có tài khoản?{" "}
              <Link href="/inventory/register" className="text-green-800 underline hover:text-green-600">Đăng ký</Link>
            </p>
            <p>
              Quên mật khẩu?{" "}
              <Link href="/inventory/forgot-password" className="text-green-800 underline hover:text-green-600">Khôi phục mật khẩu</Link>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
