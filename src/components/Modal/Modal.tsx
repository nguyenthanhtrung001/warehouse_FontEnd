// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, title, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg relative"
        style={{
          width: '60%', // Điều chỉnh kích thước của modal theo phần trăm
          maxWidth: '800px', // Giới hạn kích thước tối đa của modal
          maxHeight: '80vh', // Giới hạn chiều cao tối đa của modal
          overflowY: 'auto', // Cho phép cuộn dọc khi nội dung vượt quá chiều cao
          marginTop: '5%', // Cách từ trên
          marginLeft: '20%', // Cách từ bên trái
        }}
      >
        <button
          className="absolute top-2 right-2 text-red text-xl font-bold p-2"
          onClick={onClose}
        > 
          &times;
        </button>
        {title && (
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h1 className="text-lg font-semibold text-center">{title}</h1>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
