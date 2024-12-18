"use client";
import { Controller } from "react-hook-form";
import { SettingsFormData } from "@/types/settingsFormData"; // Import SettingsFormData

interface WebsiteSettingsFormProps {
  settings: SettingsFormData;
  onSaveWebsite: (data: { websiteName: string, websiteIcon: string }) => void;
  control: any;
  errors: any;
}

const WebsiteSettingsForm = ({ settings, onSaveWebsite, control, errors }: WebsiteSettingsFormProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cấu hình Website</h2>

      {/* Tên trang web */}
      <div>
        <label htmlFor="websiteName" className="block text-lg font-medium text-gray-700 mb-2">Tên trang web</label>
        <Controller
          name="websiteName"
          control={control}
          defaultValue={settings.websiteName || ""} // Giữ giá trị mặc định từ settings
          rules={{ required: "Tên trang web là bắt buộc" }}
          render={({ field }) => (
            <input
              id="websiteName"
              {...field} // Gắn các trường vào form
              className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              placeholder="Nhập tên trang web"
            />
          )}
        />
        {errors.websiteName && <p className="text-red-500 text-sm mt-2">{errors.websiteName.message}</p>}
      </div>

      {/* Icon trang web */}
      <div>
        <label htmlFor="websiteIcon" className="block text-lg font-medium text-gray-700 mb-2">Icon trang web</label>
        <Controller
          name="websiteIcon"
          control={control}
          defaultValue={settings.websiteIcon || ""} // Giữ giá trị mặc định từ settings
          rules={{ required: "Icon trang web là bắt buộc" }}
          render={({ field }) => (
            <input
              id="websiteIcon"
              {...field} // Gắn các trường vào form
              className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              placeholder="URL icon"
            />
          )}
        />
        {errors.websiteIcon && <p className="text-red-500 text-sm mt-2">{errors.websiteIcon.message}</p>}
      </div>

      {/* Nút lưu cấu hình website */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => {
            // Lấy dữ liệu từ form và gửi đi
            onSaveWebsite({
              websiteName: settings.websiteName,
              websiteIcon: settings.websiteIcon,
            });
          }}
          className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300"
        >
          Lưu Cấu hình Website
        </button>
      </div>
    </div>
  );
};

export default WebsiteSettingsForm;
