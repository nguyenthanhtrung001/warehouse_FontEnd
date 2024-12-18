import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from 'chart.js';
import axios from 'axios';

// Đăng ký các thang đo và thành phần cho biểu đồ cột
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Tùy chọn cho biểu đồ với định dạng tiền tệ VND
const optionsCurrencyVND: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true, // đảm bảo biểu đồ bắt đầu từ 0
      ticks: {
        callback: function (value: number | string) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
        },
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<'bar'>) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tooltipItem.raw as number);
        },
      },
    },
  },
};

// Định nghĩa kiểu dữ liệu cho Warehouse
interface Warehouse {
  id: number;
  warehouseName: string;
  revenue: number;
}

const RevenueBarChart = () => {
  // Lấy tháng và năm hiện tại
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [barData, setBarData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Xuất kho theo chi nhánh',
        data: [] as number[],
        backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ffc658'],
      },
    ],
  });

  useEffect(() => {
    // Gọi API để lấy dữ liệu doanh thu của các chi nhánh
    axios
      .get<Warehouse[]>('http://localhost:8888/v1/api/warehouses/all-revenue')
      .then((response) => {
        const warehouses = response.data;
        // Chuẩn bị dữ liệu cho biểu đồ
        const labels = warehouses.map((warehouse: Warehouse) => warehouse.warehouseName);
        const data = warehouses.map((warehouse: Warehouse) => warehouse.revenue);

        setBarData({
          labels: labels,
          datasets: [
            {
              label: 'Xuất kho theo chi nhánh',
              data: data,
              backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ffc658'],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', height: '350px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Xuất hàng theo chi nhánh - {currentMonth} {currentYear}
      </Typography>
      <Bar data={barData} options={optionsCurrencyVND} height={250} />
    </Box>
  );
};

export default RevenueBarChart;
