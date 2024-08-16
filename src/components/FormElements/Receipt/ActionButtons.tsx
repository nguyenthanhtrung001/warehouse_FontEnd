"use client"
// components/ActionButtons.tsx
import React from 'react';

interface ActionButtonsProps {
  handleComplete: () => void; // Đặt kiểu cho handleComplete là một hàm không trả về
}


const ActionButtons: React.FC<ActionButtonsProps> = ({ handleComplete }) => {
  return (
    <div className="flex space-x-4 font-bold">
      <button className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-md ">Lưu tạm</button>
      <button onClick={handleComplete} className="flex-1 px-4 py-2 text-white bg-green-600 rounded-md">Hoàn thành</button>
    </div>
  );
};

export default ActionButtons;
