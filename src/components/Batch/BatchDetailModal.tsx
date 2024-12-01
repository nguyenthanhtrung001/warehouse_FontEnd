"use client";

import React, { useState, useEffect } from "react";
import axios  from '@/utils/axiosInstance';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { BatchDetail, Location } from "@/types/batch";

export default function BatchDetailModal({
  batchId,
  onClose,
}: {
  batchId: number;
  onClose: () => void;
}) {
  const [batchDetails, setBatchDetails] = useState<BatchDetail[]>([]);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  // Fetch batch details
  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/v1/api/batch-details/batch/${batchId}`,
        );
        setBatchDetails(response.data);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };

    fetchBatchDetails();
  }, [batchId]);

  // Open location dialog and fetch locations
  const handleEditLocation = async (detailId: number) => {
    setSelectedDetailId(detailId);
    setLocationDialogOpen(true);
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

  // Update location for batch detail
  const handleLocationUpdate = async () => {
    if (!selectedDetailId || !selectedLocationId) return;
    console.log("Cập nhật thành công: ",selectedDetailId, "hbjgfdsh",selectedLocationId);
    try {
      await axios.put(
        `http://localhost:8888/v1/api/batch-details/${selectedDetailId}?locationId=${selectedLocationId}`
      );
      // Update batch details locally after a successful API call
      setBatchDetails((prev) =>
        prev.map((detail) =>
          detail.id === selectedDetailId
            ? {
                ...detail,
                location: locations.find(
                  (loc) => loc.id === selectedLocationId,
                )!,
              }
            : detail,
        ),
      );
      console.log("Cập nhật thành công");
      setLocationDialogOpen(false);
      setSelectedLocationId(null);
      setSelectedDetailId(null);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chi tiết lô hàng: {batchId}</Typography>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Vị trí</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batchDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>MK000{detail.id}</TableCell>
                  <TableCell>{detail.product.productName}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.location.warehouseLocation}</TableCell>
                  <TableCell>
                    {detail.quantity > 0 && ( // Kiểm tra số lượng trước khi hiển thị nút Edit
                      <IconButton
                        color="primary"
                        onClick={() => handleEditLocation(detail.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>

      {/* Dialog chọn vị trí */}
      <Dialog
        open={locationDialogOpen}
        onClose={() => {
          setLocationDialogOpen(false);
          setSelectedLocationId(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chọn vị trí mới</DialogTitle>
        <DialogContent>
          {loadingLocations ? (
            <CircularProgress />
          ) : (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedLocationId || ""}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
              >
                {locations.map((location) => (
                  <FormControlLabel
                    key={location.id}
                    value={location.id}
                    control={<Radio />}
                    label={location.warehouseLocation}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLocationDialogOpen(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleLocationUpdate}
            color="primary"
            variant="contained"
            disabled={!selectedLocationId}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
