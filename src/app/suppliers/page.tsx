import TableSupplier from "@/components/Tables/TableSupplier";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ToastContainer } from 'react-toastify';


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
        <TableSupplier/>
        <ToastContainer />
        
          {/* <TableOne />
        <TableThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
