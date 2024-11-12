// components/Checkout.jsx

"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const CustomerInfo = ({ onClose }) => {
  
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});
  const [customerId, setCustomerId] = useState(null);

  // Lấy danh sách tỉnh từ API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/');
        setProvinces(response.data.results);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách huyện dựa trên tỉnh đã chọn
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`);
          setDistricts(response.data.results || []);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách xã dựa trên huyện đã chọn
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`);
          setWards(response.data.results || []);
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; 
    if (!name || !nameRegex.test(name)) {
      newErrors.name = 'Họ và tên không hợp lệ!';
    }

    const phoneRegex = /^(0\d{9}|84\d{10})$/; 
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ!';
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form hợp lệ:', { name, phone, address, selectedProvince, selectedDistrict, selectedWard, paymentMethod });
      // Có thể thêm logic gửi dữ liệu đi ở đây
      onClose(); // Đóng modal sau khi gửi thành công
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mt-4">
        <div className="w-1/3 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold text-center">Thông tin nhận hàng</h2>
          <form className="mt-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Họ và tên" 
              className="border rounded p-2 w-full mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="text-red">{errors.name}</p>}
            
            <input 
              type="text" 
              placeholder="Số điện thoại" 
              className="border rounded p-2 w-full mb-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.phone && <p className="text-red">{errors.phone}</p>}
            
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setDistricts([]);
                setSelectedDistrict('');
                setWards([]);
                setSelectedWard('');
              }} 
              className="border rounded p-2 w-full mb-2"
              required
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>{province.province_name}</option>
              ))}
            </select>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setWards([]);
                setSelectedWard('');
              }} 
              className="border rounded p-2 w-full mb-2"
              required
            >
              <option value="">Chọn Huyện/Xã</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
              ))}
            </select>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)} 
              className="border rounded p-2 w-full mb-2"
              required
            >
              <option value="">Chọn Xã/Phường</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Địa chỉ chi tiết" 
              className="border rounded p-2 w-full mb-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)} 
              className="border rounded p-2 w-full mb-2"
              required
            >
              <option value="">Chọn phương thức thanh toán</option>
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="banking">Chuyển khoản ngân hàng</option>
              <option value="credit-card">Thẻ tín dụng</option>
            </select>
            {errors.paymentMethod && <p className="text-red">{errors.paymentMethod}</p>}

            <button 
              type="submit"
              className="bg-green-800 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors duration-300"
            >
              Xác nhận thanh toán
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
