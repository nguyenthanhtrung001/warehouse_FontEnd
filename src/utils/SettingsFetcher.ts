"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

interface SettingsFetcherProps {
  onIconUrlFetched: (url: string) => void; // Callback để trả về URL ảnh
}

const SettingsFetcher = ({ onIconUrlFetched }: SettingsFetcherProps) => {
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8888/v1/identity/api/settings"
        );
        const data = response.data;

        // Lấy URL của websiteIcon từ dữ liệu API
        const iconUrl =
          data.find((item: { configKey: string }) => item.configKey === "websiteIcon")
            ?.configValue || "";

        // Trả về URL ảnh qua callback
        if (iconUrl) {
          onIconUrlFetched(iconUrl);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [onIconUrlFetched]);

  return null; // Component không render gì
};

export default SettingsFetcher;
