"use client";
import { useEffect, useState } from "react";
import axiosInstance from '@/utils/axiosInstance';
import LocationList from "./LocationList";
import LocationModal from "./LocationModal";
import { Location } from "@/types/Location";
import { Container, Typography, Button, Box } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { useEmployeeStore } from '@/stores/employeeStore';



export default function LocationPage() {
  // Khai báo kiểu cho state
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    fetchLocations();
  }, []);

  // Lấy danh sách vị trí
  const fetchLocations = async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axiosInstance.get<Location[]>(`http://localhost:8888/v1/api/locations/warehouse/${employee.warehouseId}`) ;
      console.log("Data location: ", response);
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Mở modal để thêm vị trí mới
  const handleAdd = () => {
    setSelectedLocation(undefined);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa vị trí
  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  // Xóa vị trí
  const handleDelete = async (id: number) => {
    try {
      // Hiển thị hộp thoại xác nhận trước khi xóa
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn có muốn xóa địa điểm này? Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });
  
      if (result.isConfirmed) {
        // Nếu người dùng xác nhận, tiến hành xóa
        await axiosInstance.delete(`http://localhost:8888/v1/api/locations/${id}`);
        fetchLocations();
  
        // Hiển thị thông báo xóa thành công
        await Swal.fire({
          title: "Thành công!",
          text: "Địa điểm đã được xóa thành công.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error: unknown) {
      console.error("Lỗi khi xóa địa điểm:", error);
  
      // Xử lý thông báo lỗi chi tiết từ API
      let errorMessage = "Đã xảy ra lỗi khi xóa địa điểm. Vui lòng thử lại.";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }

    // Hiển thị thông báo lỗi khi xóa thất bại
    await Swal.fire({
      title: "Lỗi!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });
    }
  };
  
  // Lưu vị trí (thêm mới hoặc cập nhật)
  const handleSave = async (locationData: Omit<Location, "id">) => {
    try {
      // Thêm thuộc tính vào locationData
      const updatedLocationData = {
        ...locationData,
        warehouseId: 3,
      };
  
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: selectedLocation
          ? "Bạn có muốn cập nhật thông tin địa điểm này không?"
          : "Bạn có muốn thêm mới địa điểm này không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });
  
      if (result.isConfirmed) {
        let response;
  
        if (selectedLocation) {
          console.log("Gửi yêu cầu cập nhật:", updatedLocationData);
          // Gửi yêu cầu cập nhật
          response = await axiosInstance.put(
            `http://localhost:8888/v1/api/locations/${selectedLocation.id}`,
            updatedLocationData
          );
        } else {
          console.log("Gửi yêu cầu thêm mới:", updatedLocationData);
          // Gửi yêu cầu thêm mới
          response = await axiosInstance.post("http://localhost:8888/v1/api/locations", updatedLocationData);
        }
  
        // Lấy dữ liệu phản hồi từ API sau khi thành công
        const responseData = response.data;
  
        // Hiển thị thông báo thành công
        await Swal.fire({
          title: "Thành công!",
          text: `Thông tin địa điểm đã được lưu thành công.`,
          icon: "success",
          confirmButtonText: "OK",
        });
  
        // Cập nhật danh sách vị trí
        fetchLocations();
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi lưu địa điểm:", error);
    
      // Kiểm tra nếu error là đối tượng và có thuộc tính 'response'
      let errorMessage = "Đã xảy ra lỗi không xác định.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        if (axiosError.response && axiosError.response.data) {
          errorMessage = axiosError.response.data.message;
        }
      }
    
      // Hiển thị thông báo lỗi
      await Swal.fire({
        title: "Lỗi!",
        text: `Không thể lưu thông tin địa điểm.\nChi tiết lỗi: ${errorMessage}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    
  };
  
  
  
  

  return (
    <Container style={{ paddingTop: "4px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
       Vị trí trong kho hàng
      </Typography>
      <Box display="flex" justifyContent="flex-end" marginBottom="4px">
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm mới
        </Button>
      </Box>
      <LocationList locations={locations} onEdit={handleEdit} onDelete={handleDelete} />
      {isModalOpen && (
        <LocationModal
          initialData={selectedLocation}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </Container>
  );
}
