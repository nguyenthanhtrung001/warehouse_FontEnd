import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import ContactInfoForm from "@/components/FormElements/customer/ContactInfoForm";
import Swal from "sweetalert2";

interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  detailedAddress: string;
  email: string;
}

interface ContactInfo {
  id: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailedAddress: string;
  status: number;
}

interface CustomerSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCustomerAddress: (customer: Customer, address: ContactInfo) => void;
}

const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  isVisible,
  onClose,
  onSelectCustomerAddress,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [addresses, setAddresses] = useState<ContactInfo[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentAddress, setCurrentAddress] = useState<ContactInfo | null>(
    null,
  );
  const [isAddressModalVisible, setIsAddressModalVisible] =
    useState<boolean>(false); // New state for address modal
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search term

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.CUSTOMERS);
        setCustomers(response.data);
        setFilteredCustomers(response.data); // Initially show all customers
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchAddresses = async (customerId: number) => {
    try {
      const response = await axiosInstance.get<ContactInfo[]>(
        `http://localhost:8888/v1/api/contact-info/customer/${customerId}`,
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    
    setSelectedCustomer(customer);
    fetchAddresses(customer.id);
    setIsAddressModalVisible(true); // Show address modal when customer is selected
  };

  const handleAddressSelect = (address: ContactInfo) => {
    if (selectedCustomer) {
      setAddressId(address.id);
      onSelectCustomerAddress(selectedCustomer, address);
      onClose();
      setIsAddressModalVisible(false); // Close address modal after selection
    }
  };

  const handleOpenForm = (mode: "create" | "edit", address?: ContactInfo) => {
    setFormMode(mode);
    setCurrentAddress(address || null);
    setIsFormVisible(true);
  };

  const handleSaveAddress = (addressData: any) => {
    // No API calls, only refresh the address list
    fetchAddresses(selectedCustomer?.id!);
    setIsFormVisible(false);
  };

  // Handle the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the customers list based on the search term
    const filtered = customers.filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(term) ||
        customer.phoneNumber.includes(term) ||
        customer.detailedAddress.toLowerCase().includes(term),
    );
    setFilteredCustomers(filtered);
  };

  // Handle deleting an address
  const handleDeleteAddress = async (addressId: number) => {
    try {
      // Hiển thị hộp thoại xác nhận trước khi xóa
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa địa chỉ này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });
  
      if (result.isConfirmed) {
        // Gửi yêu cầu xóa địa chỉ
        await axiosInstance.delete(`http://localhost:8888/v1/api/contact-info/${addressId}`);
        
        Swal.fire("Đã xóa", "Địa chỉ đã được xóa thành công.", "success");
  
        // Làm mới danh sách địa chỉ sau khi xóa
        fetchAddresses(selectedCustomer?.id!);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa địa chỉ. Vui lòng thử lại.", "error");
    }
  };
  

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="Chọn khách hàng">
      <div className="space-y-4 p-4">
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm khách hàng - Tên - SDT - Địa chỉ"
          className="w-full rounded border px-4 py-2"
        />

        {/* Customer List */}
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <p className="text-gray-700 font-semibold">
                {customer.customerName}
              </p>
              <p className="text-gray-600 text-sm">
                SĐT: {customer.phoneNumber}
              </p>
            </div>
            <button
              onClick={() => handleCustomerSelect(customer)}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Chọn
            </button>
          </div>
        ))}
      </div>

      {/* Address Selection Modal */}
      {isAddressModalVisible && selectedCustomer && (
        <Modal
          isVisible={isAddressModalVisible}
          onClose={() => setIsAddressModalVisible(false)}
          title={`Địa chỉ của ${selectedCustomer.customerName}`}
        > <div className="flex justify-end">
        <button
          onClick={() => handleOpenForm("create")}
          className="mt-4 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Thêm địa chỉ
        </button>
      </div>
      
          <div className="mt-4">
           
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="text-gray-700 font-semibold">
                    {address.recipientName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.detailedAddress}, {address.ward},{" "}
                    {address.district}, {address.province}
                  </p>
                  <p className="text-gray-600 text-sm">
                    SĐT: {address.phoneNumber}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  {" "}
                  {/* Thêm lớp này để căn các nút ra bên phải */}
                  <button
                    onClick={() => handleAddressSelect(address)}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                  >
                    Chọn
                  </button>
                  <button
                    onClick={() => handleOpenForm("edit", address)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="hover:bg-red-600 rounded bg-red px-3 py-1 text-white"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
           
          </div>
        </Modal>
      )}

      {/* Address Form Modal */}
      {isFormVisible && (
        <Modal
          isVisible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          title={formMode === "create" ? "Thêm địa chỉ" : "Chỉnh sửa địa chỉ"}
        >
          <ContactInfoForm
            onChange={(addressData) => console.log(addressData)}
            initialData={
              selectedCustomer
                ? {
                    province: currentAddress?.province || "",
                    district: currentAddress?.district || "",
                    ward: currentAddress?.ward || "",
                    detailedAddress: currentAddress?.detailedAddress || "",
                    customerName: currentAddress?.recipientName || "",
                    customerPhone: currentAddress?.phoneNumber || "",
                    customerId: selectedCustomer.id, 
                  
                    addressId: currentAddress?.id,
                  }
                : null
            }
            onClose={() => setIsFormVisible(false)}
            onSave={handleSaveAddress}
          />
        </Modal>
      )}
    </Modal>
  );
};

export default CustomerSelectModal;
