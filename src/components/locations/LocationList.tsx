import React, { useState } from "react";
import { Location } from "@/types/Location"; // Đảm bảo đường dẫn đúng với cấu trúc dự án
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
} from "@mui/material";

interface LocationListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: number) => void;
}
// Enum trạng thái
const LocationStatus = {
  AVAILABLE: "AVAILABLE", // Có sẵn
  OCCUPIED: "OCCUPIED", // Đang được sử dụng
  MAINTENANCE: "MAINTENANCE", // Đang bảo trì
} as const;

const LocationList: React.FC<LocationListProps> = ({
  locations,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số hàng mỗi trang

  // Xử lý chuyển trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tính toán vị trí của các hàng trên trang hiện tại
  const paginatedLocations = locations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      style={{ marginTop: "20px" }}
    >
      <Typography
        variant="h6"
        component="div"
        style={{ padding: "16px", fontWeight: "bold" }}
      >
        Danh sách vị trí kho
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Vị trí trong kho</TableCell>
            <TableCell align="center">ID kho</TableCell>
            <TableCell align="center">Sức chứa</TableCell>
            <TableCell align="center">Tải hiện tại</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLocations.map((location) => (
            <TableRow key={location.id} hover>
              <TableCell align="center">VT000{location.id}</TableCell>
              <TableCell align="center">{location.warehouseLocation}</TableCell>
              <TableCell align="center">MK000{location.warehouseId}</TableCell>
              <TableCell align="center">
                {location.capacity !== null ? location.capacity : "N/A"}
              </TableCell>
              <TableCell align="center">
                {location.currentLoad !== null ? location.currentLoad : "N/A"}
              </TableCell>
              <TableCell align="center">
                {location.status === LocationStatus.AVAILABLE
                  ? "Có sẵn"
                  : location.status === LocationStatus.OCCUPIED
                    ? "Đang được sử dụng"
                    : location.status === LocationStatus.MAINTENANCE
                      ? "Đang bảo trì"
                      : "Không xác định"}
              </TableCell>

              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => onEdit(location)}
                  style={{ marginRight: "8px" }}
                >
                  Sửa
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => onDelete(location.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={locations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </TableContainer>
  );
};

export default LocationList;
