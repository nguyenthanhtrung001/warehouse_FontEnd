import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/LoginLayout";
import Forget from '@/components/Store/Form/Forget'

export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};

const SignIn: React.FC = () => {
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
 <Forget/>
        </div>
     
    </DefaultLayout>
  );
};

export default SignIn;
