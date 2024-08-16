import OderForm from "@/components/FormElements/order/OderForm";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddProductModal from "@/components/FormElements/product/AddProductForm";
import AddReceiptForm from "@/components/FormElements/Receipt/AddReceiptForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify
import PrintButton from '@/components/Documents/MyDocument';




export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description:
    "Thành Trung",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
       <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Quản lý nhân viên</h1>
      <PrintButton />
    </div>
    </DefaultLayout>
  );
};

export default TablesPage;
