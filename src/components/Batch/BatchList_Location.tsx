"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, TextField } from "@mui/material";
import dayjs from "dayjs"; // Thư viện xử lý ngày tháng

export default function BatchList() {
  const [batches, setBatches] = useState<any[]>([]); // Dữ liệu lô hàng
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]); // Dữ liệu sau khi tìm kiếm/lọc
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const itemsPerPage = 5; // Số lô hàng trên mỗi trang

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8888/v1/api/batch-details");
        const fetchedBatches = response.data || [];
        setBatches(fetchedBatches);
        setFilteredBatches(fetchedBatches);
        setTotalPages(Math.ceil(fetchedBatches.length / itemsPerPage));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu lô hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // Lọc và tìm kiếm lô hàng
  useEffect(() => {
    const filtered = batches.filter((batch) => 
      batch.batch.batchName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (batch.location.warehouseLocation && batch.location.warehouseLocation.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (`MH000${batch.productId}`.toLowerCase().includes(searchKeyword.toLowerCase()))||
      (`MKH000${batch.id}`.toLowerCase().includes(searchKeyword.toLowerCase()))  // Lọc theo mã sản phẩm
    );
    setFilteredBatches(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset trang về 1 khi thay đổi tìm kiếm
  }, [searchKeyword, batches]);
  

  // Lấy dữ liệu phân trang
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý khi thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Kiểm tra trạng thái hạn sử dụng
  const getExpiryStatusColor = (expiryDate: string | null) => {
    if (!expiryDate) return "green"; // Nếu không có hạn sử dụng, coi như còn hạn
    const now = dayjs();
    const expiry = dayjs(expiryDate);
    const diffDays = expiry.diff(now, "day");

    if (diffDays <= 0) return "red"; // Đã hết hạn
    if (diffDays <= 7) return "orange"; // Còn ít ngày nữa
    return "green"; // Còn hạn dài
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin chi tiết hàng trong kho
      </Typography>

      {/* Thanh tìm kiếm */}
      <Box display="flex" gap={2} marginBottom={3}>
        <TextField
          label="Tìm kiếm theo tên lô hàng hoặc vị trí kho"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          fullWidth
        />
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
                  <TableCell>Tên Lô</TableCell>
                  <TableCell>Mã Sản Phẩm</TableCell>
                  <TableCell>Hạn Sử Dụng</TableCell>
                  <TableCell>Số Lượng</TableCell>
                  <TableCell>Vị Trí Kho</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBatches.map((batch: any) => (
                  <TableRow key={batch.id}>
                    <TableCell>MKH000{batch.id}</TableCell>
                    <TableCell>{batch.batch.batchName}</TableCell>
                    <TableCell>MH000{batch.productId}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: getExpiryStatusColor(batch.batch.expiryDate),
                        }}
                      >
                        {batch.batch.expiryDate || "Chưa có hạn sử dụng"}
                      </Typography>
                    </TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{batch.location.warehouseLocation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Phân trang */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{ display: "flex", justifyContent: "center" }}
          />
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Không có dữ liệu lô hàng.
        </Typography>
      )}
    </Box>
  );
}
