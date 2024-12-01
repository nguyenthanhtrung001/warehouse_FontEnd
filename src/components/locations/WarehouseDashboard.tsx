// Danh sách vị trí lưu trữ
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Grid, Box, CircularProgress, Pagination, Typography, TextField } from "@mui/material";
import axios  from '@/utils/axiosInstance';
import LocationCard from "./LocationCard";
import BatchDetailsDialog from "./BatchDetailsDialog";
import { Location, BatchDetail } from "@/types/product_location";
import { useEmployeeStore } from '@/stores/employeeStore';

const WarehouseDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [locationsPerPage] = useState<number>(6);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [batchDetails, setBatchDetails] = useState<BatchDetail[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      if (!employee || !employee.warehouseId) return;
      try {
        const response = await axios.get(`http://localhost:8888/v1/api/locations/warehouse/${employee.warehouseId}`);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationClick = async (location: Location) => {
    setSelectedLocation(location);
    setLoadingProducts(true);
    try {
      const response = await axios.get(
        `http://localhost:8888/v1/api/batch-details/location/${location.id}`
      );
      setBatchDetails(response.data);
    } catch (error) {
      console.error("Error fetching batch details:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedLocation(null);
    setBatchDetails([]);
  };

  const filteredLocations = useMemo(() => {
    // Lọc theo từ khóa tìm kiếm
    if (!searchKeyword.trim()) return locations;
    return locations.filter((location) =>
      location.warehouseLocation.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [locations, searchKeyword]);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Danh sách vị trí lưu trữ
      </Typography>

      {/* Thanh tìm kiếm */}
      <TextField
        label="Tìm kiếm "
        variant="outlined"
        fullWidth
        value={searchKeyword}
        onChange={handleSearchChange}
        sx={{ marginBottom: 3 }}
      />

      {loadingLocations ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentLocations.map((location) => (
              <Grid item xs={12} sm={6} md={4} key={location.id}>
                <LocationCard location={location} onClick={handleLocationClick} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" marginTop={3}>
            <Pagination
              count={Math.ceil(filteredLocations.length / locationsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </>
      )}

      <BatchDetailsDialog
        open={Boolean(selectedLocation)}
        onClose={handleCloseDialog}
        loading={loadingProducts}
        batchDetails={batchDetails}
      />
    </Box>
  );
};

export default WarehouseDashboard;
