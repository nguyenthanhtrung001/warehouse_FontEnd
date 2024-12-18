"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEmployeeStore } from "@/stores/employeeStore";
import axios from "@/utils/axiosInstance";
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
  const { employee } = useEmployeeStore();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatConfig, setChatConfig] = useState<any>(null);

  useEffect(() => {
    const fetchChatConfig = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/identity/api/settings/chat-config");
        const configData = response.data.reduce((acc: any, curr: any) => {
          acc[curr.configKey] = curr.configValue; // Biến đổi mảng thành đối tượng với key là configKey
          return acc;
        }, {});
        setChatConfig(configData); // Lưu cấu hình vào state
      } catch (error) {
        console.error("Error fetching chat config", error);
      }
    };

    fetchChatConfig();
  }, []);

  useEffect(() => {
    if (!chatConfig || !employee) return;

    const sdkScript = document.createElement("script");
    sdkScript.src = chatConfig.script; // Sử dụng cấu hình script từ API
    sdkScript.defer = true;

    sdkScript.onload = () => {
      if (window.CozeWebSDK) {
        const newConversationId = generateNewConversationId();
        setConversationId(newConversationId);

        const cozeWebSDK = new window.CozeWebSDK.WebChatClient({
          config: {
            botId: chatConfig.botId,  // Lấy botId từ cấu hình API
            conversationId: newConversationId,
            auto_save_history: false,
          },
          // auth: {
          //   type: "token",
          //   token: chatConfig.token,  // Lấy token từ cấu hình API
          //   onRefreshToken: async () => chatConfig.token,
          // },
          userInfo: {
            id: employee?.accountId,
            url: "https://example.com/avatar.png",
            nickname: employee?.employeeName,
          },
          componentProps: {
            title: chatConfig.chatTitle,  // Lấy chatTitle từ cấu hình API
            themeColor: "#ff6600",
          },
          footer: {
            isShow: true,
            expressionText: "Powered by {{name}}",
            linkvars: {
              name: {
                text: "Trung",
                link: "https://www.test1.com",
              },
            },
          },
        });
        console.log("chat: ", cozeWebSDK);
      }
    };

    document.body.appendChild(sdkScript);

    return () => {
      document.body.removeChild(sdkScript);
    };
  }, [chatConfig, employee]);

  const generateNewConversationId = () => {
    return "conv_" + new Date().getTime(); // Tạo conversationId bằng thời gian hiện tại
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
