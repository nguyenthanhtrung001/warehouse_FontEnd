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

  // Cập nhật conversationId mỗi khi người dùng hoặc nhân viên tham gia một kênh mới
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    // Tạo script để tải Coze SDK
    
    const sdkScript = document.createElement("script");
    sdkScript.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js";
    sdkScript.defer = true;

    // Khởi tạo Coze Web Chat Client sau khi SDK đã được tải
    sdkScript.onload = () => {
      if (window.CozeWebSDK) {
        // Tạo conversationId cho kênh mới
        const newConversationId = generateNewConversationId(); // Hàm này sẽ tạo ra ID cho kênh mới

        setConversationId(newConversationId);

        // Khởi tạo Coze Web Chat Client với các cấu hình
        const cozeWebSDK = new window.CozeWebSDK.WebChatClient({
          config: {
            botId: '7444861346590113800',
            conversationId: newConversationId, // Đặt conversationId mới cho mỗi kênh
            auto_save_history: false, // Tắt lưu trữ lịch sử
          },
          auth: {
            type: 'token',
            token: 'pat_ZjdPxxWjqF5XJpib2SFAyvK7hwqSfAzjyUjxM5W4hk3gDzqKiGT6uv9n6q7tcLiD',
            onRefreshToken: async () => 'pat_ZjdPxxWjqF5XJpib2SFAyvK7hwqSfAzjyUjxM5W4hk3gDzqKiGT6uv9n6q7tcLiD',
          },
          userInfo: {
            id: '1234894',
            url: 'https://example.com/avatar.png',
            nickname: 'John Doe',
          },
          componentProps: {
            title: 'Trợ lý kho 1',
            themeColor: '#ff6600',
          },
          footer: {
            isShow: true,
            expressionText: 'Powered by {{name}}',
            linkvars: {
              name: {
                text: 'Trung',
                link: 'https://www.test1.com'
              }
            }
          }
        });
        console.log("chat: ",cozeWebSDK)

        // Khi bạn muốn hủy hoặc đóng cuộc trò chuyện
        // cozeWebSDK.destroy(); // Hủy chat khi cần thiết
      }
    };

    // Thêm script vào DOM
    document.body.appendChild(sdkScript);

    // Cleanup khi component unmounts
    return () => {
      document.body.removeChild(sdkScript);
    };
  }, []); // Chỉ chạy 1 lần khi component mount

  // Hàm tạo mới conversationId
  const generateNewConversationId = () => {
    return 'conv_' + new Date().getTime(); // Tạo conversationId bằng thời gian hiện tại (hoặc bạn có thể sử dụng phương thức khác)
  };

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
