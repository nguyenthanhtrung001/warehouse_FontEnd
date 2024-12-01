import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

interface ContactInfoFormProps {
  onChange: (addressData: any) => void;
  initialData?: {
    province: string;
    district: string;
    ward: string;
    detailedAddress: string;
    customerName: string;
    customerPhone: string;
    customerId?: number;  
    addressId?:number,
  } | null;
  onClose: () => void; // Close the modal
  onSave: (data: any) => void; // Handle the save action
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  onChange,
  initialData = null,
  onClose,
  onSave,
}) => {
  const [provinces, setProvinces] = useState<any[]>([]); // List of provinces
  const [districts, setDistricts] = useState<any[]>([]); // List of districts
  const [wards, setWards] = useState<any[]>([]); // List of wards

  const [selectedProvince, setSelectedProvince] = useState<string>(
    initialData?.province || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialData?.district || ""
  );
  const [selectedWard, setSelectedWard] = useState<string>(
    initialData?.ward || ""
  );
  const [detailedAddress, setDetailedAddress] = useState<string>(
    initialData?.detailedAddress || ""
  );
  const [customerName, setCustomerName] = useState<string>(
    initialData?.customerName || ""
  );
  const [customerPhone, setCustomerPhone] = useState<string>(
    initialData?.customerPhone || ""
  );

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://vapi.vnappmob.com/api/province/");
        setProvinces(response.data.results || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts based on selected province
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
        .then((response) => {
          setDistricts(response.data.results || []);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedProvince]);

  // Fetch wards based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`)
        .then((response) => {
          setWards(response.data.results || []);
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict("");
    setSelectedWard("");
    onChange({
      province,
      district: "",
      ward: "",
      detailedAddress,
      customerName,
      customerPhone,
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedWard("");
    onChange({
      province: selectedProvince,
      district,
      ward: "",
      detailedAddress,
      customerName,
      customerPhone,
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ward = e.target.value;
    setSelectedWard(ward);
    onChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward,
      detailedAddress,
      customerName,
      customerPhone,
    });
  };

  const handleDetailedAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setDetailedAddress(address);
    onChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      detailedAddress: address,
      customerName,
      customerPhone,
    });
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCustomerName(name);
    onChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      detailedAddress,
      customerName: name,
      customerPhone,
    });
  };

  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setCustomerPhone(phone);
    onChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      detailedAddress,
      customerName,
      customerPhone: phone,
    });
  };



  const handleSave = () => {
    // Tạo cửa sổ xác nhận
    Swal.fire({
      title: 'Bạn có chắc chắn muốn lưu không?',
      text: 'Dữ liệu sẽ được lưu lại!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        // Xử lý khi người dùng xác nhận lưu
        const selectedProvinceObj = provinces.find(province => province.province_id === selectedProvince);
        const selectedDistrictObj = districts.find(district => district.district_id === selectedDistrict);
        const selectedWardObj = wards.find(ward => ward.ward_id === selectedWard);
  
        const addressData = {
          province: selectedProvinceObj ? selectedProvinceObj.province_name : "",
          district: selectedDistrictObj ? selectedDistrictObj.district_name : "",
          ward: selectedWardObj ? selectedWardObj.ward_name : "",
          detailedAddress: detailedAddress,
          recipientName: customerName,
          phoneNumber: customerPhone,
          customerId: initialData?.customerId ?? 0, 
          
        };
        console.log("Data post: ", JSON.stringify(addressData,null,2));
        console.log("Data : ", initialData?.customerName);
        // Tiến hành lưu dữ liệu
        if (initialData?.customerName) {
         
          axios
            .put(`http://localhost:8888/v1/api/contact-info/${initialData?.addressId}`, addressData)
            .then(() => {
              onSave(addressData);
              Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật.', 'success'); // Thông báo thành công
            })
            .catch((error) => {
              console.error("Error updating contact info:", error);
              Swal.fire('Lỗi!', 'Đã có lỗi xảy ra trong quá trình cập nhật.', 'error'); // Thông báo lỗi
            });
        } else {
          console.log("Data post: ", JSON.stringify(addressData,null,2));
          axios
            .post("http://localhost:8888/v1/api/contact-info", addressData)
            .then(() => {
              onSave(addressData);
              Swal.fire('Thành công!', 'Dữ liệu đã được lưu.', 'success'); // Thông báo thành công
            })
            .catch((error) => {
              console.error("Error saving contact info:", error);
              Swal.fire('Lỗi!', 'Đã có lỗi xảy ra trong quá trình lưu dữ liệu.', 'error'); // Thông báo lỗi
            });
        }
      } else {
        // Nếu người dùng hủy
        Swal.fire('Đã hủy', 'Dữ liệu không được thay đổi.', 'info');
      }
    });
  };
  
  

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg w-full">
      {/* Customer Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-800">Tên khách hàng</label>
          <input
            type="text"
            value={customerName}
            onChange={handleCustomerNameChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Số điện thoại</label>
          <input
            type="text"
            value={customerPhone}
            onChange={handleCustomerPhoneChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-800">Tỉnh/Thành phố</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Quận/Huyện</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Phường/Xã</label>
          <select
            value={selectedWard}
            onChange={handleWardChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Địa chỉ chi tiết</label>
          <input
            type="text"
            value={detailedAddress}
            onChange={handleDetailedAddressChange}
            className="w-full px-3 py-2 mt-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      {/* Buttons for Save and Close */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default ContactInfoForm;
