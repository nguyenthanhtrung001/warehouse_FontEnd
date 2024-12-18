// components/OrderInfo.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/product";
import axios from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes"; // Import API_ROUTES
import Modal from "@/components/Modal/Modal";
import LocationModal from "@/components/locations/LocationModal";
import FormAddSupplier from "@/components/FormElements/supplier/AddSupplierForm";
import { useEmployeeStore,  initializeEmployeeFromLocalStorage,} from "@/stores/employeeStore";
import { Location } from "@/types/Location";
import { toast } from "react-toastify";
import CurrentTime from '@/utils/currentTime';
import Swal from "sweetalert2";

interface OrderInfoProps {
  products: Product[];
  selectedSupplier: string; // Thêm prop này để nhận selectedSupplier từ component cha
  setSelectedSupplier: React.Dispatch<React.SetStateAction<string>>;
  setBatchName: React.Dispatch<React.SetStateAction<string>>;
  setExpiryDate: React.Dispatch<React.SetStateAction<string>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<number>>;
  setEmployeeId: React.Dispatch<React.SetStateAction<number>>;

  batchName: string;
  expiryDate: string;
  note: string;
  location: number;
  employeeId: number;
}

interface Supplier {
  id: number;
  supplierName: string;
  phoneNumber: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  products,
  selectedSupplier,
  setSelectedSupplier,
  setBatchName,
  setExpiryDate,
  setNote,
  setLocation,
  setEmployeeId,
  batchName,
  expiryDate,
  note,
  location,
  employeeId,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const { employee } = useEmployeeStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >(undefined);

  const [globalValue, setGlobalValue] = useState<number>(0);

  useEffect(() => {
    initializeEmployeeFromLocalStorage();
  }, []);

  useEffect(() => {
    const total = products.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0,
    );
    const totalQuantity = products.reduce(
      (acc, product) => acc + product.quantity,
      0,
    );
    setGlobalValue(totalQuantity);
    setTotalPrice(total);
    setAmountDue(total); // Bạn có thể điều chỉnh tính toán cần trả nhà cung cấp dựa vào logic của bạn
  }, [products,globalValue]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get<Supplier[]>(API_ROUTES.SUPPLIERS);
      console.log("Fetched suppliers:", response.data);
      setSuppliers(response.data);
     
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  }, []);
  

  // Mở modal để thêm vị trí mới
  const handleAdd = async () => {
    setSelectedLocation(undefined);
    setIsModalOpen(true);
    await fetchSuppliers(); 
  };
 

const handleSave = async (locationData: Omit<Location, "id">) => {
  console.log("Data location before update: ", JSON.stringify(locationData, null, 2));

  // Định nghĩa lại warehouseId
  const updatedLocationData = {
    ...locationData,
    warehouseId: employee?.warehouseId, // Thay thế bằng giá trị warehouseId mới
  };

  console.log("Data location after update: ", JSON.stringify(updatedLocationData, null, 2));

  try {
    // Gửi dữ liệu POST
    await axios.post("http://localhost:8888/v1/api/locations", updatedLocationData);

    // Hiển thị thông báo thành công
    Swal.fire({
      title: "Thành công!",
      text: "Đã lưu vị trí kho với Warehouse ID mới thành công.",
      icon: "success",
      confirmButtonText: "OK",
    });

    setIsModalOpen(false); // Đóng modal sau khi lưu thành công
  } catch (error) {
    console.error("Error saving location:", error);

    // Hiển thị thông báo thất bại
    Swal.fire({
      title: "Thất bại!",
      text: "Không thể lưu vị trí kho. Vui lòng thử lại.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};


  const fetchLocations = useCallback(async () => {
    try {
      if (!employee || !employee.warehouseId) return;
      const response = await axios.get<Location[]>(`http://localhost:8888/v1/api/locations/warehouse/${employee?.warehouseId}`);
      console.log("Fetched locations:", response.data); 
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, [employee,]);

  useEffect(() => {
    fetchLocations();
    fetchSuppliers();
  }, [fetchLocations,fetchSuppliers,globalValue]);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (globalValue <= 0) {
      toast.error("Số lượng phải lớn hơn 0 để chọn vị trí lưu trữ.");
      return;
    }

    const selectedLocationId = Number(e.target.value);
    const selectedLocation = locations.find(
      (loc) => loc.id === selectedLocationId,
    );

    if (selectedLocation) {
      const capacity = selectedLocation.capacity ?? 0;
      const currentLoad = selectedLocation.currentLoad ?? 0;
      const remainingCapacity = capacity - currentLoad;

      if (remainingCapacity >= globalValue) {
        setLocation(selectedLocationId);
        toast.success(
          `Vị trí ${selectedLocation.warehouseLocation} đã được chọn.`,
        );
      } else {
        toast.error(
          `Vị trí ${selectedLocation.warehouseLocation} không đủ chứa (${remainingCapacity} chỗ trống, cần ${globalValue}).`,
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const handleCloseModal = () => {
    setShowAddSupplierForm(false);
  };

  return (
    <div className="bg-gray-100 rounded-md border bg-blue-50 p-4 text-sm">
      <div className="mb-4 flex justify-between">
        {employee ? (
          <span className="font-bold text-red">{employee.employeeName}</span>
        ) : (
          <p>No employee data available</p>
        )}
         <CurrentTime />
      </div>
      <div className="space-y-4 ">
        <div className="flex justify-between">
          <label className="font-bold">Phiếu nhập</label>
          <input
            type="text"
            value="Mã phiếu tự động"
            disabled
            className=" w-36 border border-green-500 p-1 text-center font-bold text-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Tên lô hàng: </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="border-gray-300 w-36 border-b p-1"
          />
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Hạn sử dụng:</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border-gray-300 w-36 border-b p-1"
          />
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Vị trí kho:</label>
          <div>
            <button
              className="rounded-md bg-blue-500 px-2 pb-2 text-white"
              onClick={handleAdd}
            >
              +
            </button>

            <select
              value={globalValue > 0 ? location.toString() : ""}
              onChange={handleLocationChange}
              className="border-gray-300 ml-2 w-36 border-b pb-2"
              disabled={globalValue <= 0} // Vô hiệu hóa toàn bộ nếu số lượng sản phẩm là 0
            >
              <option value="" disabled>
                {globalValue <= 0 ? "Chọn SP trước" : "Chọn vị trí kho"}
              </option>
              {locations
                .map((location) => {
                  const capacity = location.capacity ?? 0;
                  const currentLoad = location.currentLoad ?? 0;
                  const remainingCapacity = capacity - currentLoad;

                  return { ...location, remainingCapacity };
                })
                .sort((a, b) => {
                  if (
                    a.remainingCapacity >= globalValue &&
                    b.remainingCapacity < globalValue
                  )
                    return -1;
                  if (
                    a.remainingCapacity < globalValue &&
                    b.remainingCapacity >= globalValue
                  )
                    return 1;
                  return b.remainingCapacity - a.remainingCapacity;
                })
                .map((location, index) => (
                  <option
                    key={location.id}
                    value={location.id.toString()}
                    disabled={
                      globalValue <= 0 ||
                      location.remainingCapacity < globalValue
                    } // Vô hiệu hóa nếu không hợp lệ
                  >
                    {`${index + 1}. ${location.warehouseLocation} - Sức chứa: ${location.capacity ?? "N/A"}, Còn trống: ${
                      location.remainingCapacity >= 0
                        ? location.remainingCapacity
                        : "N/A"
                    }`}
                  </option>
                ))}
            </select>
          </div>
          {/* Modal thêm nhà cung cấp */}
          <Modal
            isVisible={showAddSupplierForm}
            onClose={handleCloseModal}
            title="THÊM NHÀ CUNG CẤP"
          >
            <FormAddSupplier />
          </Modal>

          {isModalOpen && (
            <LocationModal
              initialData={selectedLocation}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
            />
          )}
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Cung cấp:</label>

          <div>
            <button
              className="rounded-md bg-blue-500 px-2 pb-2 text-white"
              onClick={() => setShowAddSupplierForm(true)}
            >
              +
            </button>
            <select
              value={selectedSupplier}
              onChange={handleSupplierChange}
              className="border-gray-300 ml-2 w-36 border-b pb-2"
            >
              <option value="">Nhà cung cấp</option>
              {suppliers.map((supplier, index) => (
                <option key={supplier.id} value={supplier.id.toString()}>
                  {`${index + 1}. ${supplier.supplierName} - ${supplier.phoneNumber ?? "Không có số"}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Trạng thái</label>
          <span className="text-blue-500">Phiếu tạm</span>
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Tổng tiền hàng</label>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Cần trả nhà cung cấp</label>
          <span className="font-bold text-red">
            {formatCurrency(amountDue)}
          </span>
        </div>
        <div className="flex justify-between">
          <label className="font-bold">Ghi chú</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-gray-300 border-b p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
