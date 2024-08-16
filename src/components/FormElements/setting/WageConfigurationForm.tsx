"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from '@/utils/axiosInstance';
import Swal from 'sweetalert2';

interface WageConfiguration {
  id: number;
  latePenalty: number;
  bonus: number;
  earlyPenalty: number;
  hours: number;
}

const WageConfigurationForm: React.FC = () => {
  const [config, setConfig] = useState<WageConfiguration>({
    id: 0,
    latePenalty: 0,
    bonus: 0,
    earlyPenalty: 0,
    hours: 0,
  });

  const [originalConfig, setOriginalConfig] = useState<WageConfiguration>({
    id: 0,
    latePenalty: 0,
    bonus: 0,
    earlyPenalty: 0,
    hours: 0,
  });

  useEffect(() => {
    const fetchOriginalConfig = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8888/v1/api/wage-configurations');
        const result = response.data;
       
        setOriginalConfig(result);
        setConfig(result);  // Đặt cấu hình hiện tại bằng cấu hình gốc
      } catch (error) {
        console.error('Lỗi khi lấy cấu hình gốc:', error);
      }
    };
    
    fetchOriginalConfig();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = name === 'hours' ? parseInt(value) : parseFloat(value);

    // Chỉ cập nhật nếu giá trị không âm
    if (numberValue >= 0) {
      setConfig({
        ...config,
        [name]: numberValue,
      });
    }
  };

  const hasChanges = () => {
    return JSON.stringify(config) !== JSON.stringify(originalConfig);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!hasChanges()) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Không có thay đổi nào để cập nhật.',
        icon: 'warning',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn cập nhật cấu hình lương không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        // In dữ liệu cấu hình ra console trước khi gửi đi
        console.log('Dữ liệu gửi đi:', {
          latePenalty: config.latePenalty,
          bonus: config.bonus,
          earlyPenalty: config.earlyPenalty,
          hours: config.hours,
        });
  
        await axiosInstance.post('http://localhost:8888/v1/api/wage-configurations/create', {
          latePenalty: config.latePenalty,
          bonus: config.bonus,
          earlyPenalty: config.earlyPenalty,
          hours: config.hours,
        });
  
        Swal.fire({
          title: 'Thành công',
          text: 'Cấu hình lương đã được cập nhật thành công!',
          icon: 'success',
        });
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        Swal.fire({
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi cập nhật cấu hình lương.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-green-50 to-green-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-green-800">
        Cấu Hình Lương
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-5">
          <label
            htmlFor="latePenalty"
            className="block text-base font-semibold text-green-800 mb-2"
          >
            Phạt Trễ
          </label>
          <input
            type="number"
            name="latePenalty"
            value={config.latePenalty}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            min="0"  // Chỉ cho phép số không âm
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="bonus"
            className="block text-base font-semibold text-green-800 mb-2"
          >
            Thưởng Thêm
          </label>
          <input
            type="number"
            name="bonus"
            value={config.bonus}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            min="0"  // Chỉ cho phép số không âm
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="earlyPenalty"
            className="block text-base font-semibold text-green-800 mb-2"
          >
            Phạt Về Sớm
          </label>
          <input
            type="number"
            name="earlyPenalty"
            value={config.earlyPenalty}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            min="0"  // Chỉ cho phép số không âm
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="hours"
            className="block text-base font-semibold text-green-800 mb-2"
          >
            Số Giờ
          </label>
          <input
            type="number"
            name="hours"
            value={config.hours}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300"
            min="0"  // Chỉ cho phép số không âm
            required
          />
        </div>

        <div className="text-center col-span-2">
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
          >
            Cập Nhật Cấu Hình
          </button>
        </div>
      </form>
    </div>
  );
};

export default WageConfigurationForm;
