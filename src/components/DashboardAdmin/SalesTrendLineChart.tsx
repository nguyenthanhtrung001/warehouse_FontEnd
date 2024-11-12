import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

// Đăng ký các thành phần của biểu đồ đường
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const optionsCurrencyVND: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear',
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
        label: function (tooltipItem: TooltipItem<'line'>) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tooltipItem.raw as number);
        },
      },
    },
  },
};

interface RevenueData {
  month: string;
  revenue: number;
}

const SalesTrendLineChart = () => {
  const [lineData, setLineData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Xu hướng doanh số',
        data: [] as number[],
        borderColor: '#82ca9d',
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    // Hàm lấy dữ liệu từ API bằng axios
    const fetchData = async () => {
      try {
        const response = await axios.get<RevenueData[]>('http://localhost:8888/v1/api/return-notes/revenue-warehouse-12-month');
        const data = response.data;

        // Lấy labels và data từ API response
        const labels = data.map(item => item.month);
        const revenueData = data.map(item => item.revenue);

        // Cập nhật lineData với dữ liệu mới
        setLineData({
          labels: labels,
          datasets: [
            {
              label: 'Xu hướng doanh số',
              data: revenueData,
              borderColor: '#82ca9d',
              borderWidth: 2,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', height: '350px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Xu hướng doanh số
      </Typography>
      <Line data={lineData} options={optionsCurrencyVND} height={250} />
    </Box>
  );
};

export default SalesTrendLineChart;
