
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Report from "@/components/report/form-import-export/report";



const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-12">

        <Report/>

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
