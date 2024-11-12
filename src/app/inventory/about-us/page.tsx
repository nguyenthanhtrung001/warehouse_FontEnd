
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

import AboutUs from '@/components/Store/About-Us/AboutUs';

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

        <AboutUs />
      </div>
    </StoreLayout>
  );
};

export default TablesPage;
