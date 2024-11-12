import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/LoginLayout";
import LoginForm from './formLogin'

export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};

const SignIn: React.FC = () => {
  return (
    <DefaultLayout>
      <LoginForm/>
    </DefaultLayout>
  );
};

export default SignIn;
