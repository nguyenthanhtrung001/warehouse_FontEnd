import React from 'react';
import AdminDashboard from "@/components/DashboardAdmin/AdminDashboard";
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const Home = () => {
  return (
    <DefaultLayout>
      <AdminDashboard />
    </DefaultLayout>
  );
};

export default Home;
