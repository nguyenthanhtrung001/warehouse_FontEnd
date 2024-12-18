// components/ChatSettingsForm.tsx
"use client";
import { Controller } from "react-hook-form";
import { SettingsFormData } from "@/types/settingsFormData"; // Đảm bảo import đúng kiểu dữ liệu

interface ChatSettingsFormProps {
  settings: SettingsFormData;
  onSaveChatSettings: (data: { botId: string, script: string, token: string, chatTitle: string }) => void;
  control: any;
  errors: any;
}

const ChatSettingsForm = ({ settings, onSaveChatSettings, control, errors }: ChatSettingsFormProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cấu hình Chat</h2>

      {/* Bot ID */}
      <div>
        <label htmlFor="botId" className="block text-lg font-medium text-gray-700 mb-2">Bot ID</label>
        <Controller
          name="botId"
          control={control}
          defaultValue={settings.botId} // Gán giá trị mặc định
          rules={{ required: "Bot ID là bắt buộc" }}
          render={({ field }) => (
            <input
              id="botId"
              {...field} // Liên kết trường với react-hook-form
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
          defaultValue={settings.token} // Gán giá trị mặc định
          rules={{ required: "Token là bắt buộc" }}
          render={({ field }) => (
            <input
              id="token"
              {...field} // Liên kết trường với react-hook-form
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
          defaultValue={settings.script} // Gán giá trị mặc định
          rules={{ required: "Script là bắt buộc" }}
          render={({ field }) => (
            <textarea
              id="script"
              {...field} // Liên kết trường với react-hook-form
              className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              placeholder="Nhập script"
              rows={5}
            />
          )}
        />
        {errors.script && <p className="text-red-500 text-sm mt-2">{errors.script.message}</p>}
      </div>

      {/* Tiêu đề chat */}
      <div>
        <label htmlFor="chatTitle" className="block text-lg font-medium text-gray-700 mb-2">Tiêu đề chat</label>
        <Controller
          name="chatTitle"
          control={control}
          defaultValue={settings.chatTitle} // Gán giá trị mặc định
          rules={{ required: "Tiêu đề chat là bắt buộc" }}
          render={({ field }) => (
            <input
              id="chatTitle"
              {...field} // Liên kết trường với react-hook-form
              className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              placeholder="Nhập tiêu đề chat"
            />
          )}
        />
        {errors.chatTitle && <p className="text-red-500 text-sm mt-2">{errors.chatTitle.message}</p>}
      </div>

      {/* Nút lưu cấu hình chat */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => {
            onSaveChatSettings({
              botId: settings.botId,
              script: settings.script,
              token: settings.token,
              chatTitle: settings.chatTitle,
            });
          }}
          className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300"
        >
          Lưu Cấu hình Chat
        </button>
      </div>
    </div>
  );
};

export default ChatSettingsForm;
