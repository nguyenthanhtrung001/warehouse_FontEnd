import React from "react";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";
import { Location } from "@/types/product_location";

interface Props {
  location: Location;
  onClick: (location: Location) => void;
}

const LocationCard: React.FC<Props> = ({ location, onClick }) => {
  const percentFull =
    location.capacity && location.currentLoad
      ? Math.round((location.currentLoad / location.capacity) * 100)
      : 0;

  return (
    <Card
      onClick={() => onClick(location)}
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
          <strong>Trạng thái:</strong> {location.status || "Chưa xác định"}
        </Typography>
        <Typography>
          <strong>Dung lượng:</strong> {location.currentLoad || 0}/
          {location.capacity || "Không xác định"}
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
  );
};

export default LocationCard;
