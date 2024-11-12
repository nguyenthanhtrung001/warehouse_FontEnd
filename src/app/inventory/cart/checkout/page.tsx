
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

import Checkout from '@/components/Store/Checkout/Checkout';

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

        <Checkout />
      </div>
    </StoreLayout>
  );
};

export default TablesPage;
