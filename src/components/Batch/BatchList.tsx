"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BatchDetailModal from "./BatchDetailModal";
import { Batch } from "@/types/batch";
import { Modal } from "@mui/material";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEmployeeStore } from "@/stores/employeeStore";
import Swal from "sweetalert2";

export default function BatchList() {
  const [batches, setBatches] = useState<Batch[]>([]); // Dữ liệu các lô hàng
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]); // Dữ liệu sau khi tìm kiếm/lọc
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null); // Lô hàng được chọn
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Trạng thái modal
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const [expiryFilter, setExpiryFilter] = useState<string>("all"); // Bộ lọc hạn sử dụng

  const itemsPerPage = 5; // Số lô hàng trên mỗi trang
  const { employee } = useEmployeeStore();
  // cập nhật hạng sử dụng
  const [isUpdateExpiryModalOpen, setIsUpdateExpiryModalOpen] = useState(false);
  const [selectedBatchForUpdate, setSelectedBatchForUpdate] =
    useState<Batch | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<string>("");

  // Hàm mở modal cập nhật hạn sử dụng
  const openUpdateExpiryDateModal = (batch: Batch) => {
    setSelectedBatchForUpdate(batch);
    setNewExpiryDate(batch.expiryDate || ""); // Gán hạn sử dụng hiện tại vào form
    setIsUpdateExpiryModalOpen(true);
  };

  // Hàm đóng modal cập nhật hạn sử dụng
  const closeUpdateExpiryDateModal = () => {
    setIsUpdateExpiryModalOpen(false);
    setSelectedBatchForUpdate(null);
    setNewExpiryDate("");
  };
  const handleUpdateExpiryDate = async () => {
    if (!selectedBatchForUpdate || !newExpiryDate) {
      return;
    }

    try {
      // Gửi yêu cầu cập nhật đến API
      await axios.put(
        `http://localhost:8888/v1/api/batches/${selectedBatchForUpdate.id}1111`,
        { expiryDate: newExpiryDate },
      );

      // Đóng modal trước khi hiển thị Swal
      setIsUpdateExpiryModalOpen(false);

      // Chờ một chút để đảm bảo modal đã đóng hoàn toàn
      await new Promise((resolve) => setTimeout(resolve, 300)); // Thời gian chờ 300ms

      // Hiển thị thông báo thành công
      await Swal.fire({
        title: "Thành công!",
        text: "Hạn sử dụng đã được cập nhật.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Cập nhật lại danh sách lô hàng
      const updatedBatches = batches.map((batch) =>
        batch.id === selectedBatchForUpdate.id
          ? { ...batch, expiryDate: newExpiryDate }
          : batch,
      );

      setBatches(updatedBatches);
      setFilteredBatches(updatedBatches);
    } catch (error) {
      console.error("Lỗi khi cập nhật hạn sử dụng:", error);

      // Đóng modal trước khi hiển thị Swal
      setIsUpdateExpiryModalOpen(false);

      // Chờ một chút để đảm bảo modal đã đóng hoàn toàn
      await new Promise((resolve) => setTimeout(resolve, 300)); // Thời gian chờ 300ms

      // Hiển thị thông báo lỗi
      await Swal.fire({
        title: "Lỗi!",
        text: "Không thể cập nhật hạn sử dụng. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchBatches = async () => {
      if (!employee) {
        return;
      }
      setLoading(true);
      setError(null);
      console.log("data:", employee.warehouseId);
      try {
        const response = await axios.get(
          `http://localhost:8888/v1/api/batches/in-warehouse/${employee.warehouseId}`,
        );

        const fetchedBatches = response.data || []; // Đảm bảo mảng dữ liệu

        // Lấy ngày hiện tại
        const today = new Date();
        const todayTimestamp = today.getTime(); // Đổi sang timestamp (dạng số)

        fetchedBatches.forEach(
          (batch: {
            expiryDate: string | number | Date;
            note: string;
            statusColor: string;
          }) => {
            if (batch.expiryDate) {
              const expiryDate = new Date(batch.expiryDate);
              const expiryTimestamp = expiryDate.getTime(); // Chuyển đổi hạn sử dụng thành timestamp

              // Kiểm tra xem hạn sử dụng sắp hết hay đã hết
              if (expiryTimestamp <= todayTimestamp) {
                batch.note = "Đã hết hạn"; // Nếu hết hạn
                batch.statusColor = "red"; // Màu đỏ
              } else if (
                expiryTimestamp <=
                todayTimestamp + 7 * 24 * 60 * 60 * 1000
              ) {
                // Cộng 7 ngày vào ngày hiện tại
                batch.note = "Sắp hết hạn"; // Nếu sắp hết hạn (7 ngày)
                batch.statusColor = "yellow"; // Màu vàng
              }
            } else {
              batch.statusColor = "gray"; // Màu xám nếu expiryDate là null
              batch.note = "Chưa xác định"; // Nếu không có hạn sử dụng
            }
          },
        );

        // Sắp xếp theo hạn sử dụng
        fetchedBatches.sort(
          (
            a: { expiryDate: string | number | Date },
            b: { expiryDate: string | number | Date },
          ) => {
            if (a.expiryDate && b.expiryDate) {
              const expiryTimestampA = new Date(a.expiryDate).getTime();
              const expiryTimestampB = new Date(b.expiryDate).getTime();
              return expiryTimestampA - expiryTimestampB; // Lô có hạn sử dụng gần nhất lên đầu
            } else if (a.expiryDate && !b.expiryDate) {
              return -1; // Đưa lô có expiryDate lên trước
            } else if (!a.expiryDate && b.expiryDate) {
              return 1; // Đưa lô không có expiryDate xuống dưới
            }
            return 0;
          },
        );

        setBatches(fetchedBatches); // Gán dữ liệu lô hàng
        setFilteredBatches(fetchedBatches); // Gán dữ liệu ban đầu vào bộ lọc
        setTotalPages(Math.ceil(fetchedBatches.length / itemsPerPage)); // Tính tổng số trang
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu lô hàng. Vui lòng thử lại.");
        setBatches([]); // Nếu lỗi, đặt dữ liệu thành mảng rỗng
        setFilteredBatches([]);
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchBatches();
  }, [employee]);

  // Lọc và tìm kiếm lô hàng
  useEffect(() => {
    let filtered = batches;

    // Tìm kiếm theo tên lô
    if (searchKeyword) {
      filtered = filtered.filter((batch) =>
        batch.batchName.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }

    // Lọc theo hạn sử dụng
    const today = new Date();
    if (expiryFilter === "expired") {
      filtered = filtered.filter(
        (batch) => batch.expiryDate && new Date(batch.expiryDate) < today, // Kiểm tra null và so sánh
      );
    } else if (expiryFilter === "notExpired") {
      filtered = filtered.filter(
        (batch) => batch.expiryDate && new Date(batch.expiryDate) >= today, // Kiểm tra null và so sánh
      );
    }

    setFilteredBatches(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm/lọc
  }, [searchKeyword, expiryFilter, batches]);

  // Lấy dữ liệu phân trang
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Xử lý khi thay đổi trang
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  // Mở modal
  const openModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBatch(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách lô hàng
      </Typography>

      {/* Tìm kiếm và lọc */}
      <Box display="flex" gap={2} marginBottom={3}>
        <TextField
          label="Tìm kiếm theo tên lô - ngày nhập lô"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ flex: 3 }} // Chiều dài tỷ lệ lớn hơn
        />
        <TextField
          label="Lọc hạn sử dụng"
          select
          variant="outlined"
          value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)}
          sx={{ flex: 1 }} // Chiều dài tỷ lệ nhỏ hơn
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="expired">Đã hết hạn</MenuItem>
          <MenuItem value="notExpired">Còn hạn</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : paginatedBatches && paginatedBatches.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên lô</TableCell>
                  <TableCell>Hạn sử dụng</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.id}</TableCell>
                    <TableCell>{batch.batchName}</TableCell>
                    <TableCell>{batch.expiryDate}</TableCell>
                    <TableCell
                      style={{
                        color:
                          batch.statusColor === "red"
                            ? "red"
                            : batch.statusColor === "yellow"
                              ? "yellow"
                              : batch.statusColor === "gray"
                                ? "gray"
                                : "",
                        fontWeight: "bold", // In đậm
                      }}
                    >
                      {batch.note || "Không có ghi chú"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openModal(batch)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => openUpdateExpiryDateModal(batch)}
                        sx={{ marginLeft: 1 }}
                      >
                        Cập nhật hạn sử dụng
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: "flex", justifyContent: "center" }}
          />
        </>
      ) : (
        <Typography>Không có dữ liệu để hiển thị.</Typography>
      )}
      {isModalOpen && selectedBatch && (
        <BatchDetailModal batchId={selectedBatch.id} onClose={closeModal} />
      )}
      {/* Modal cập nhật hạn sử dụng */}
      {isUpdateExpiryModalOpen && selectedBatchForUpdate && (
        <Modal
          open={isUpdateExpiryModalOpen}
          onClose={closeUpdateExpiryDateModal}
          disablePortal
          aria-labelledby="update-expiry-modal-title"
          aria-describedby="update-expiry-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4, // Padding
              borderRadius: 2, // Bo tròn góc
            }}
          >
            <Typography
              id="update-expiry-modal-title"
              variant="h6"
              marginBottom={2}
            >
              Cập nhật hạn sử dụng cho lô: {selectedBatchForUpdate.batchName}
            </Typography>
            <TextField
              label="Hạn sử dụng mới"
              type="date"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateExpiryDate}
              fullWidth
            >
              Cập nhật
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}
