import TableProduct from "@/components/Tables/TableProduct";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddReceiptForm from "@/components/FormElements/Receipt-update/AddReceiptForm";


export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description:
    "Thành Trung",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Mặt hàng" /> */}
     
      <div className="flex flex-col gap-12">
      
        {/* <TableTwo /> */}
        <AddReceiptForm/>
          {/* <TableOne />
        <TableThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
