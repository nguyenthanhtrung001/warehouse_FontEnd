"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { storage, ref, uploadBytes, getDownloadURL } from '@/utils/firebase';
import Swal from "sweetalert2"; 


interface SettingsFormData {
  websiteName: string;
  websiteIcon: string;
  botId: string;
  script: string;
  token: string;
  chatTitle: string;
}

const SettingsPage = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<SettingsFormData>();
  const [settings, setSettings] = useState<SettingsFormData>({
    websiteName: "",
    websiteIcon: "",
    botId: "",
    script: "",
    token: "",
    chatTitle: "",
  });
  const [file, setFile] = useState<File | null>(null); 

 // Fetch settings data from the API when the component mounts
 useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8888/v1/identity/api/settings");
      const data = response.data;

      // Map API response to form values
      const mappedData: SettingsFormData = {
        websiteName: data.find((item: { configKey: string; }) => item.configKey === "websiteName")?.configValue || "",
        websiteIcon: data.find((item: { configKey: string; }) => item.configKey === "websiteIcon")?.configValue || "",
        botId: data.find((item: { configKey: string; }) => item.configKey === "botId")?.configValue || "",
        script: data.find((item: { configKey: string; }) => item.configKey === "script")?.configValue || "",
        token: data.find((item: { configKey: string; }) => item.configKey === "token")?.configValue || "",
        chatTitle: data.find((item: { configKey: string; }) => item.configKey === "chatTitle")?.configValue || "",
      };

      // Set form values using react-hook-form's setValue
      setValue("websiteName", mappedData.websiteName);
      setValue("websiteIcon", mappedData.websiteIcon);
      setValue("botId", mappedData.botId);
      setValue("script", mappedData.script);
      setValue("token", mappedData.token);
      setValue("chatTitle", mappedData.chatTitle);
      setSettings(mappedData);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  fetchSettings();
}, [setValue]);

// Hàm xử lý chọn file và upload ảnh
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files ? e.target.files[0] : null;
  if (file) {
    try {
      const storageRef = ref(storage, `website-icons/${file.name}`);
      await uploadBytes(storageRef, file); // Tải lên Firebase Storage
      const fileUrl = await getDownloadURL(storageRef); // Lấy URL ảnh sau khi tải lên

      // Cập nhật giá trị websiteIcon với URL mới
      setValue("websiteIcon", fileUrl);
      setSettings((prevState) => ({ ...prevState, websiteIcon: fileUrl }));
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Upload file thất bại",
        text: "Có lỗi xảy ra khi tải lên ảnh.",
      });
    }
  }
};

// Hàm xử lý submit form
const onSubmit = async (data: SettingsFormData) => {
  try {
    const response = await axiosInstance.post("http://localhost:8888/v1/identity/api/settings", data);
    Swal.fire({
      icon: "success",
      title: "Lưu thành công",
      text: "Cài đặt đã được cập nhật!",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    Swal.fire({
      icon: "error",
      title: "Cập nhật thất bại",
      text: "Có lỗi xảy ra khi lưu cài đặt.",
    });
  }
};

  // Gửi yêu cầu lưu Tên trang web và Icon trang web
  const handleSaveWebsite = async (data: { websiteName: string, websiteIcon: string }) => {
    try {
      console.log("Saving website settings:", JSON.stringify(data, null, 2));
      const response = await axiosInstance.post("http://localhost:8888/v1/identity/api/settings/website", data);
      setSettings(prevState => ({
        ...prevState,
        websiteName: data.websiteName,
        websiteIcon: data.websiteIcon,
      }));
      // Show success alert using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Cấu hình website đã được lưu!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error saving website settings", error);
      // Show error alert using SweetAlert2
     
    }
  };

  // Gửi yêu cầu lưu Cấu hình Chat
  const handleSaveChatSettings = async (data: { botId: string, script: string, token: string, chatTitle: string }) => {
    try {
      console.log("Saving chat settings:", data);
      const response = await axiosInstance.post("http://localhost:8888/v1/identity/api/settings/chat", data);
      setSettings(prevState => ({
        ...prevState,
        botId: data.botId,
        script: data.script,
        token: data.token,
        chatTitle: data.chatTitle,
      }));
      // Show success alert using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Cấu hình chat đã được lưu!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error saving chat settings", error);
      // Show error alert using SweetAlert2
      
    }
  };

  // Hàm xử lý khi lưu cấu hình website
  const onSaveWebsite = (data: { websiteName: string, websiteIcon: string }) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn lưu cấu hình website?',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveWebsite(data);
      }
    });
  };

  // Hàm xử lý khi lưu cấu hình chat
  const onSaveChat = (data: { botId: string, script: string, token: string, chatTitle: string }) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn lưu cấu hình chat?',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveChatSettings(data);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="p-8 max-w-4xl w-full bg-white shadow-2xl rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-blue-700">Cấu hình trang web</h1>

        <form className="space-y-8">
          {/* Tên trang web */}
          <div>
            <label htmlFor="websiteName" className="block text-lg font-medium text-gray-700 mb-2">Tên trang web</label>
            <Controller
              name="websiteName"
              control={control}
              defaultValue={settings.websiteName}
              rules={{ required: "Tên trang web là bắt buộc" }}
              render={({ field }) => (
                <input
                  id="websiteName"
                  {...field}
                  className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                  placeholder="Nhập tên trang web"
                />
              )}
            />
            {errors.websiteName && <p className="text-red-500 text-sm mt-2">{errors.websiteName.message}</p>}
          </div>

          <div className="flex flex-col items-center p-6">
      <label
        htmlFor="file-upload"
        className="flex items-center space-x-2 bg-green-500 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer hover:bg-green-600"
      >
        <span className="text-xl">📁</span>
        <span>Chọn Icon Website</span>
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {settings.websiteIcon && (
        <div className="mt-4 flex justify-center">
          <img
            src={settings.websiteIcon}
            alt="Current Icon"
            className="w-24 h-24 rounded-lg object-cover border-2 border-gray-300"
          />
        </div>
      )}
    </div>

          {/* Nút lưu cấu hình website */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={handleSubmit(onSaveWebsite)}
              className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300"
            >
              Lưu Cấu hình Website
            </button>
          </div>

          {/* Cấu hình Chat */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cấu hình Chat</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bot ID */}
              <div>
                <label htmlFor="botId" className="block text-lg font-medium text-gray-700 mb-2">Bot ID</label>
                <Controller
                  name="botId"
                  control={control}
                  defaultValue={settings.botId}
                  rules={{ required: "Bot ID là bắt buộc" }}
                  render={({ field }) => (
                    <input
                      id="botId"
                      {...field}
                      className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                      placeholder="Nhập Bot ID"
                    />
                  )}
                />
                {errors.botId && <p className="text-red-500 text-sm mt-2">{errors.botId.message}</p>}
              </div>

              {/* Token */}
              <div>
                <label htmlFor="token" className="block text-lg font-medium text-gray-700 mb-2">Token</label>
                <Controller
                  name="token"
                  control={control}
                  defaultValue={settings.token}
                  rules={{ required: "Token là bắt buộc" }}
                  render={({ field }) => (
                    <input
                      id="token"
                      {...field}
                      className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                      placeholder="Nhập token"
                    />
                  )}
                />
                {errors.token && <p className="text-red-500 text-sm mt-2">{errors.token.message}</p>}
              </div>

              {/* Script */}
              <div className="col-span-full">
                <label htmlFor="script" className="block text-lg font-medium text-gray-700 mb-2">Script</label>
                <Controller
                  name="script"
                  control={control}
                  defaultValue={settings.script}
                  rules={{ required: "Script là bắt buộc" }}
                  render={({ field }) => (
                    <input
                      id="script"
                      {...field}
                      className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                      placeholder="Nhập script"
                    />
                  )}
                />
                {errors.script && <p className="text-red-500 text-sm mt-2">{errors.script.message}</p>}
              </div>

              {/* Chat Title */}
              <div className="col-span-full">
                <label htmlFor="chatTitle" className="block text-lg font-medium text-gray-700 mb-2">Chat Title</label>
                <Controller
                  name="chatTitle"
                  control={control}
                  defaultValue={settings.chatTitle}
                  rules={{ required: "Chat Title là bắt buộc" }}
                  render={({ field }) => (
                    <input
                      id="chatTitle"
                      {...field}
                      className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                      placeholder="Nhập chat title"
                    />
                  )}
                />
                {errors.chatTitle && <p className="text-red-500 text-sm mt-2">{errors.chatTitle.message}</p>}
              </div>
            </div>

            {/* Nút lưu cấu hình chat */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleSubmit(onSaveChat)}
                className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300"
              >
                Lưu Cấu hình Chat
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
