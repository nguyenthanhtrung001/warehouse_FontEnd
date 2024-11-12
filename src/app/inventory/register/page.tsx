
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

import Register from '@/components/Store/Form/Register';

import StoreLayout from "@/components/Layouts/StoreLayout";

export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description:
    "Thành Trung",
};

const TablesPage = () => {
  return (


    <StoreLayout>
      {/* <Breadcrumb pageName="Mặt hàng" /> */}

      <div className="flex flex-col gap-12">
        <div
          className="flex justify-center items-center py-5"
          style={{
            backgroundImage: "url('/images/logo/Login_green.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          <Register />
        </div>
      </div>
    </StoreLayout>
  );
};

export default TablesPage;
