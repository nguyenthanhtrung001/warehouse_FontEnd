"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Box,
  CircularProgress,
  Pagination,
  List,
  ListItem,
} from "@mui/material";

interface Location {
  id: number;
  warehouseLocation: string;
  warehouseId: number;
  status: string | null;
  capacity: number | null;
  currentLoad: number | null;
}

interface Product {
  id: number;
  productName: string;
  weight: number;
  description: string;
  status: number;
  quantity: number;
}

interface BatchDetail {
  product: Product;
  quantity: number;
}

export default function WarehouseDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [locationsPerPage] = useState<number>(6); // Số lượng vị trí hiển thị trên mỗi trang
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [batchDetails, setBatchDetails] = useState<BatchDetail[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const response = await axios.get(
          "http://localhost:8888/v1/api/locations",
        );
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Handle click on location card
  const handleLocationClick = async (location: Location) => {
    setSelectedLocation(location);
    setLoadingProducts(true);

    try {
      const response = await axios.get(
        `http://localhost:8888/v1/api/batch-details/location/${location.id}`,
      );
      setBatchDetails(response.data);
    } catch (error) {
      console.error("Error fetching batch details:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setSelectedLocation(null);
    setBatchDetails([]);
  };

  // Pagination logic
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(
    indexOfFirstLocation,
    indexOfLastLocation,
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Danh sách vị trí lưu trữ
      </Typography>
      {loadingLocations ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentLocations.map((location) => {
              const percentFull =
                location.capacity && location.currentLoad
                  ? Math.round((location.currentLoad / location.capacity) * 100)
                  : 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={location.id}>
                  <Card
                    onClick={() => handleLocationClick(location)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#ffffff",
                      "&:hover": { backgroundColor: "#f1f8ff" },
                      boxShadow: 3,
                      borderRadius: 3,
                      padding: 2,
                      border: "1px solid #d6e0f0",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#1565c0", marginBottom: 1 }}
                      >
                        {location.warehouseLocation}
                      </Typography>
                      <Typography>
                        <strong>Trạng thái:</strong>{" "}
                        {location.status || "Chưa xác định"}
                      </Typography>
                      <Typography>
                        <strong>Dung lượng:</strong> {location.currentLoad || 0}
                        /{location.capacity || "Không xác định"}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentFull}
                        sx={{
                          marginTop: 2,
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#e0e0e0",
                        }}
                        color={percentFull > 80 ? "error" : "primary"}
                      />
                      <Typography
                        sx={{
                          marginTop: 1,
                          fontWeight: "bold",
                          color: "#5a5a5a",
                        }}
                      >
                        Đã sử dụng: {percentFull}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box display="flex" justifyContent="center" marginTop={3}>
            <Pagination
              count={Math.ceil(locations.length / locationsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Dialog to show batch details */}
      <Dialog
  open={Boolean(selectedLocation)}
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    {selectedLocation?.warehouseLocation || "Chi tiết vị trí"}
  </DialogTitle>
  <DialogContent>
    {loadingProducts ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    ) : batchDetails.length > 0 ? (
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
            {batchDetails.map((detail, index) => (
              <tr
                key={detail.product.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f4f9ff" : "#ffffff",
                  color: "#333333",
                }}
              >
                <td style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}>
                  {index + 1}
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
      
    ) : (
      <Typography>Không có sản phẩm nào tại vị trí này.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" variant="contained">
      Đóng
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
