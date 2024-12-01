import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Pagination,
} from "@mui/material";
import { BatchDetail } from "@/types/product_location";

interface Props {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  batchDetails: BatchDetail[];
}

const BatchDetailsDialog: React.FC<Props> = ({
  open,
  onClose,
  loading,
  batchDetails,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Số sản phẩm hiển thị mỗi trang
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Lọc và phân trang sản phẩm
  const filteredDetails = useMemo(
    () =>
      batchDetails.filter((detail) =>
        detail.product.productName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      ),
    [batchDetails, searchKeyword]
  );

  const paginatedDetails = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDetails.slice(startIndex, endIndex);
  }, [filteredDetails, currentPage, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết vị trí</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : batchDetails.length > 0 ? (
          <>
            {/* Thanh tìm kiếm */}
            <TextField
              label="Tìm kiếm sản phẩm"
              variant="outlined"
              fullWidth
              value={searchKeyword}
              onChange={handleSearchChange}
              sx={{ marginBottom: 2 }}
            />

            {/* Bảng danh sách sản phẩm */}
            <Box sx={{ overflowX: "auto", marginTop: 2 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1565c0", color: "#ffffff" }}>
                    <th style={{ padding: "12px", borderBottom: "2px solid #e0e0e0" }}>STT</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #e0e0e0" }}>Tên sản phẩm</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #e0e0e0" }}>Số lượng</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #e0e0e0" }}>Mô tả</th>
                    <th style={{ padding: "12px", borderBottom: "2px solid #e0e0e0" }}>Trọng lượng (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDetails.map((detail, index) => (
                    <tr
                      key={detail.product.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f4f9ff" : "#ffffff",
                        color: "#333333",
                      }}
                    >
                      <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                        {detail.product.productName}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                        {detail.quantity}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                        {detail.product.description}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                        {detail.product.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {/* Phân trang */}
            <Box display="flex" justifyContent="center" marginTop={3}>
              <Pagination
                count={Math.ceil(filteredDetails.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        ) : (
          <Typography>Không có sản phẩm nào tại vị trí này.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchDetailsDialog;
