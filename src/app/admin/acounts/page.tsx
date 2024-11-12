import AccountManagement  from "./accounts";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Mặt hàng" /> */}
      <div className="flex flex-col gap-12">
        {/* <TableTwo /> */}
        <AccountManagement  />
        {/* <TableOne />
        <TableThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
