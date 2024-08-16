
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Chart  from "@/components/Charts/ChartProductSaleFor12Month";


export const metadata: Metadata = {
  title: "QUẢN LÝ KHO HÀNG",
  description: "Thành Trung",
};
const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-12">
          <h1 className=" text-black text-3xl font-bold text-center ">BIỂU ĐỒ THỂ HIỆN XU HƯỚNG MUA HÀNG TRONG NĂM</h1>
        <Chart/>

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
