import TableCustomer from "@/components/Batch/BatchList_Location";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { ToastContainer } from "react-toastify";


export const metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-12">
        {/* Bảng danh sách lô hàng */}
        <TableCustomer />
      
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
