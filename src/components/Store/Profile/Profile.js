"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { decrypt } from '@/utils/cryptoUtils'; // Nhập hàm giải mã

const UserProfile = () => {
  const [user, setUser] = useState({
    customerName: '',
    email: '',
    phoneNumber: null,
    dateOfBirth: null,
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  // State cho việc thay đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Giải mã thông tin khách hàng từ localStorage khi component được mount
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        const decryptedCustomer = JSON.parse(decrypt(storedCustomer));
        setUser(decryptedCustomer); // Cập nhật thông tin người dùng
        setFormData(decryptedCustomer); // Cập nhật thông tin form
      } catch (error) {
        console.error('Failed to decrypt customer data:', error);
      }
    }
  }, []); // Chạy một lần khi component được mount

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    setUser(formData);
    setIsEditing(false);
    
    // Cập nhật lại dữ liệu trong localStorage
    localStorage.setItem('customer', JSON.stringify(formData));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    
    if (currentPassword !== 'passwordCuDaDien') { // Thay thế bằng mật khẩu thật
      setPasswordError("Mật khẩu hiện tại không đúng!");
      return;
    }

    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: 'Xác nhận cập nhật mật khẩu',
      text: "Bạn có chắc chắn muốn cập nhật mật khẩu mới không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    });

    if (result.isConfirmed) {
      // Nếu người dùng xác nhận, cập nhật mật khẩu ở đây
      setPasswordError('');
      console.log("Cập nhật mật khẩu thành công");
      Swal.fire('Cập nhật!', 'Mật khẩu đã được cập nhật.', 'success');
      
      // Reset trường nhập mật khẩu sau khi cập nhật
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Thông Tin Cá Nhân</h1>

      {/* Thông Tin Cá Nhân */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <div className="space-y-4">
              <div>
              <label className="block font-bold">Email</label>
              <div className="flex items-center border rounded">
                <FaEnvelope className="ml-2 text-gray-600" />
                <p className="border-none font-bold text-black w-full p-2">{formData.email}</p> {/* Email không chỉnh sửa */}
              </div>
            </div>

            <div>
              <label className="block font-bold">Tên</label>
              <div className="flex items-center border rounded">
                <FaUser className="ml-2 text-gray-600" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="border-none w-full p-2"
                />
              </div>
            </div>
          
            <div>
              <label className="block font-bold">Số điện thoại</label>
              <div className="flex items-center border rounded">
                <FaPhone className="ml-2 text-gray-600" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''} // Đảm bảo giá trị không phải null
                  onChange={handleInputChange}
                  className="border-none w-full p-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold">Ngày sinh</label>
              <div className="flex items-center border rounded">
                <FaLock className="ml-2 text-gray-600" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''} // Đảm bảo giá trị không phải null
                  onChange={handleInputChange}
                  className="border-none w-full p-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold">Địa chỉ</label>
              <div className="flex items-center border rounded">
                <FaMapMarkerAlt className="ml-2 text-gray-600" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-none w-full p-2"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSaveChanges}
                className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div>
              <p className="font-bold">Email:</p>
              <p className='font-bold text-black'>{user.email}</p>
            </div>
            <div>
              <p className="font-bold">Tên:</p>
              <p>{user.customerName}</p>
            </div>
           
            <div>
              <p className="font-bold">Số điện thoại:</p>
              <p>{user.phoneNumber}</p>
            </div>
            <div>
              <p className="font-bold">Ngày sinh:</p>
              <p>{user.dateOfBirth}</p>
            </div>
            <div>
              <p className="font-bold">Địa chỉ:</p>
              <p>{user.address}</p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              >
                Chỉnh Sửa Thông Tin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tùy chọn thay đổi mật khẩu */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Thay Đổi Mật Khẩu</h2>
        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <div>
            <label className="block font-bold">Mật khẩu hiện tại</label>
            <div className="flex items-center border rounded">
              <FaLock className="ml-2 text-gray-600" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-none w-full p-2"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold">Mật khẩu mới</label>
            <div className="flex items-center border rounded">
              <FaLock className="ml-2 text-gray-600" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-none w-full p-2"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold">Xác nhận mật khẩu mới</label>
            <div className="flex items-center border rounded">
              <FaLock className="ml-2 text-gray-600" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-none w-full p-2"
              />
            </div>
          </div>
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Cập Nhật Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
