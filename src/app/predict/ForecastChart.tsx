import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ForecastResult } from "@/types/predict";

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Hàm nhóm dữ liệu theo itemId
const groupDataByItemId = (data: ForecastResult[]) => {
  const grouped: { [key: string]: ForecastResult[] } = {};
  data.forEach((item) => {
    if (!grouped[item.itemId]) {
      grouped[item.itemId] = [];
    }
    grouped[item.itemId].push(item);
  });
  return grouped;
};

interface ForecastChartProps {
  data: ForecastResult[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const groupedData = groupDataByItemId(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        data={data.map((d) => ({
          ...d,
          forecastTimestamp: formatTimestamp(d.forecastTimestamp),
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="forecastTimestamp" />
        <YAxis />
        <Tooltip formatter={(value) => value.toLocaleString("vi-VN")} />
        <Legend />
        {Object.entries(groupedData).map(([itemId, itemData]) => (
          <Line
            key={itemId}
            type="monotone"
            dataKey="forecastValue"
            name={`Sản phẩm ${itemId}`}
            data={itemData}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Màu ngẫu nhiên
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;
