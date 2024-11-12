"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

declare global {
  interface Window {
    CozeWebSDK: any;
  }
}

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Tạo script để tải Coze SDK
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js";
    sdkScript.defer = true;

    // Khởi tạo Coze Web Chat Client sau khi SDK đã được tải
    sdkScript.onload = () => {
      if (window.CozeWebSDK) {
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: '7432590346132996097',
          },
          componentProps: {
            title: 'Trợ lý kho',
          },
        });
      }
    };

    // Thêm script vào DOM
    document.body.appendChild(sdkScript);

    return () => {
      document.body.removeChild(sdkScript); // Cleanup khi component unmounts
    };
  }, []);

  return (
    <>
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex">
        {/* ===== Sidebar Start ===== */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* ===== Sidebar End ===== */}

        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col lg:ml-56">
          {/* ===== Header Start ===== */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* ===== Header End ===== */}

          {/* ===== Main Content Start ===== */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-8">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </>
  );
}
