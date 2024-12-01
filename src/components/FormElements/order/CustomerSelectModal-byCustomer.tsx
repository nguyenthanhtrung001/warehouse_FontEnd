import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import ContactInfoForm from "@/components/FormElements/customer/ContactInfoForm";

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
  const [customer, setCustomer] = useState<Customer | null>(null); // Customer duy nhất
  const [addresses, setAddresses] = useState<ContactInfo[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [currentAddress, setCurrentAddress] = useState<ContactInfo | null>(null);

  useEffect(() => {
    // Fetch customer data only when modal is visible
    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`${API_ROUTES.CUSTOMERS}/1`); // Replace with actual customer ID
        setCustomer(response.data);
        fetchAddresses(response.data.id); // Fetch addresses based on customer id
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    if (isVisible) {
      fetchCustomer(); // Fetch customer data only when modal is open
    }
  }, [isVisible]);

  const fetchAddresses = async (customerId: number) => {
    try {
      const response = await axiosInstance.get<ContactInfo[]>(
        `http://localhost:8888/v1/api/contact-info/customer/${customerId}`
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddressSelect = (address: ContactInfo) => {
    if (customer) {
      onSelectCustomerAddress(customer, address);
      onClose(); // Close modal after selecting address
    }
  };

  const handleOpenForm = (mode: "create" | "edit", address?: ContactInfo) => {
    setFormMode(mode);
    setCurrentAddress(address || null); // Set current address if in edit mode
    setIsFormVisible(true); // Open form
  };

  const handleSaveAddress = () => {
    // Reload addresses after saving
    if (customer) {
      fetchAddresses(customer.id);
    }
    setIsFormVisible(false); // Close form after saving
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="Chọn địa chỉ khách hàng">
      {/* Customer Display */}
      {customer && (
        <div className="space-y-4 p-4">
          <div className="text-lg font-semibold">
            <p>{customer.customerName}</p>
            <p>{customer.phoneNumber}</p>
            <p>{customer.detailedAddress}</p>
          </div>

          {/* Add Address Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenForm("create")}
              className="mt-4 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Thêm địa chỉ
            </button>
          </div>

          {/* Address Selection */}
          {addresses.length > 0 ? (
            <div className="mt-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div>
                    <p className="text-gray-700 font-semibold">{address.recipientName}</p>
                    <p className="text-gray-600 text-sm">
                      {address.detailedAddress}, {address.ward}, {address.district}, {address.province}
                    </p>
                    <p className="text-gray-600 text-sm">SĐT: {address.phoneNumber}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có địa chỉ cho khách hàng này</p>
          )}
        </div>
      )}

      {/* Address Form Modal */}
      {isFormVisible && (
        <Modal
          isVisible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          title={formMode === "create" ? "Thêm địa chỉ" : "Chỉnh sửa địa chỉ"}
        >
          <ContactInfoForm
            onChange={(addressData) => console.log(addressData)} // Handle change if needed
            initialData={
              customer
                ? {
                    province: currentAddress?.province || "",
                    district: currentAddress?.district || "",
                    ward: currentAddress?.ward || "",
                    detailedAddress: currentAddress?.detailedAddress || "",
                    customerName: currentAddress?.recipientName || "",
                    customerPhone: currentAddress?.phoneNumber || "",
                    customerId: customer.id,
                    addressId: currentAddress?.id,
                  }
                : null
            }
            onClose={() => setIsFormVisible(false)} // Close form without saving
            onSave={handleSaveAddress} // Save address and refresh list
          />
        </Modal>
      )}
    </Modal>
  );
};

export default CustomerSelectModal;
