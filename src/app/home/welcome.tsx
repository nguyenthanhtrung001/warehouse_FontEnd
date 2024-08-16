import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Bạn đã đăng nhập thành công.
          </p>
        </div>
       
       
      </div>
    </div>
  );
};

export default Welcome;
