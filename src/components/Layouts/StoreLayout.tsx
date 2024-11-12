"use client";

import React, { useState, ReactNode } from "react";
import Header from "@/components/Store/Header";
import Footer from '@/components/Store/Footer';


export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
<div className="flex flex-col min-h-screen">
  
  {/* <!-- ===== Content Area Start ===== --> */}
  <div className="relative flex flex-1 flex-col w-full">

    {/* <!-- ===== Header Start ===== --> */}
    <Header />
    {/* <!-- ===== Header End ===== --> */}

    {/* <!-- ===== Main Content Start ===== --> */}
    <main className="flex-1">
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-8">
        {children}
      </div>
    </main>
    {/* <!-- ===== Main Content End ===== --> */}

    {/* <!-- ===== Footer Start ===== --> */}
    <div className="w-full bg-green-800">
      <Footer />
    </div>
    {/* <!-- ===== Footer End ===== --> */}

  </div>
  {/* <!-- ===== Content Area End ===== --> */}
</div>
{/* <!-- ===== Page Wrapper End ===== --> */}

    </>
  );
}
