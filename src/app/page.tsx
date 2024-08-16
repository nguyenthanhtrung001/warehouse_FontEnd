import Home from "./home/welcome";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};

export default function  Page() {
  return (
    <>
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    </>
  );
}
