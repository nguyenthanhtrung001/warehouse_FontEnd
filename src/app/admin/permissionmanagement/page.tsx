
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PermissionManagement from "@/components/PermissionManagement/PermissionManagement";


const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-12">

        <PermissionManagement/>

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
