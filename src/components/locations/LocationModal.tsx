import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { Location } from "@/types/Location";

// Enum trạng thái
const LocationStatus = {
  AVAILABLE: "AVAILABLE", // Có sẵn
  OCCUPIED: "OCCUPIED", // Đang được sử dụng
  MAINTENANCE: "MAINTENANCE", // Đang bảo trì
} as const;

type LocationStatusType = (typeof LocationStatus)[keyof typeof LocationStatus];

interface LocationModalProps {
  onClose: () => void;
  onSave: (locationData: Omit<Location, "id">) => Promise<void>;
  initialData?: Partial<Location>;
}

const LocationModal: React.FC<LocationModalProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<Location, "id"> & { status: "" | LocationStatusType }>({
    warehouseLocation: "",
    warehouseId: 0,
    capacity: 0,
    currentLoad: 0,
    status: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        warehouseLocation: initialData.warehouseLocation || "",
        warehouseId: initialData.warehouseId || 0,
        capacity: initialData.capacity || 0,
        currentLoad: initialData.currentLoad ?? 0,
        status: (initialData.status as LocationStatusType) || "",
      }));
    }
  }, [initialData]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "warehouseId" || name === "capacity" || name === "currentLoad"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value as LocationStatusType | "";
    setFormData((prevData) => ({
      ...prevData,
      status: selectedValue,
    }));
  };

  const handleSubmit = async () => {
    // Kiểm tra dữ liệu form
    if (
      !formData.warehouseLocation.trim() || // Kiểm tra tên vị trí
      (formData.capacity ?? 0) <= 0 || // Kiểm tra sức chứa phải lớn hơn 0
      !formData.status // Kiểm tra trạng thái phải được chọn
    ) {
      alert("Vui lòng điền đầy đủ thông tin trước khi lưu."); // Thông báo lỗi
      return; // Dừng việc gửi form
    }
  
    // Gửi dữ liệu nếu hợp lệ
    const currentData = { ...formData };
    await onSave(currentData);
    onClose();
  };
  

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Chỉnh sửa vị trí" : "Thêm vị trí mới"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Vị trí trong kho"
          name="warehouseLocation"
          value={formData.warehouseLocation}
          onChange={handleTextFieldChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sức chứa"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleTextFieldChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            name="status"
            value={formData.status || ""} // Đảm bảo giá trị luôn hợp lệ
            onChange={handleSelectChange}
          >
            <MenuItem value="">Chọn trạng thái</MenuItem>
            <MenuItem value="AVAILABLE">Có sẵn</MenuItem>
            <MenuItem value="OCCUPIED">Đang được sử dụng</MenuItem>
            <MenuItem value="MAINTENANCE">Đang bảo trì</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationModal;
