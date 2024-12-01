import Product_Location from "@/components/locations/WarehouseDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description:
    "Thành Trung",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-12">
        <Product_Location/>
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
