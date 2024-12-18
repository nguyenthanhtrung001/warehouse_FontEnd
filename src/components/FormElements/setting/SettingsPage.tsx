"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import WebsiteSettingsForm from "./WebsiteSettingsForm";
import ChatSettingsForm from "./ChatSettingsForm";
import axios from "axios";

interface SettingsFormData {
  websiteName: string;
  websiteIcon: string;
  botId: string;
  script: string;
  token: string;
  chatTitle: string;
}

const SettingsPage = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<SettingsFormData>();
  const [settings, setSettings] = useState<SettingsFormData>({
    websiteName: "",
    websiteIcon: "",
    botId: "",
    script: "",
    token: "",
    chatTitle: "",
  });

  // Gửi yêu cầu lưu Tên trang web và Icon trang web
  const handleSaveWebsite = async (data: { websiteName: string, websiteIcon: string }) => {
    try {
      console.log("gia tri gui di:",data);
      const response = await axios.post("/api/settings/website", data);
      setSettings(prevState => ({
        ...prevState,
        websiteName: data.websiteName,
        websiteIcon: data.websiteIcon,
      }));
    } catch (error) {
      console.error("Error saving website settings", error);
    }
  };

  // Gửi yêu cầu lưu Cấu hình Chat
  const handleSaveChatSettings = async (data: { botId: string, script: string, token: string, chatTitle: string }) => {
    try {
      const response = await axios.post("/api/settings/chat", data);
      setSettings(prevState => ({
        ...prevState,
        botId: data.botId,
        script: data.script,
        token: data.token,
        chatTitle: data.chatTitle,
      }));
    } catch (error) {
      console.error("Error saving chat settings", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="p-8 max-w-4xl w-full bg-white shadow-2xl rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-blue-700">Cấu hình trang web</h1>

        <form onSubmit={handleSubmit(() => {})} className="space-y-8">
          {/* Cấu hình Website */}
          <WebsiteSettingsForm
            settings={settings}
            onSaveWebsite={handleSaveWebsite}
            control={control}
            errors={errors}
          />

          {/* Cấu hình Chat */}
          <ChatSettingsForm
            settings={settings}
            onSaveChatSettings={handleSaveChatSettings}
            control={control}
            errors={errors}
          />
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
