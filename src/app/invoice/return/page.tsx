import ReturnOderForm from "@/components/FormElements/ReturnOrder/ReturnOderForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify




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
        <ReturnOderForm/>
        <ToastContainer />
        
          {/* <TableOne />
        <TableThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
