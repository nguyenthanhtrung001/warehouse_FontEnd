import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Đăng ký các thành phần cho biểu đồ tròn
ChartJS.register(ArcElement, Tooltip, Legend);

const ProductDistributionPieChart = () => {
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'],
      },
    ],
  });

  useEffect(() => {
    // Gọi API để lấy dữ liệu phân bổ sản phẩm cho tháng hiện tại
    axios
      .get('http://localhost:8888/v1/api/invoice-details/products/quantities/current-month')
      .then((response) => {
        const products = response.data;
        const labels = products.map((product: { productName: any; }) => product.productName);
        const data = products.map((product: { quantity: any; }) => product.quantity);

        setPieData({
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching product quantities:", error);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', height: '350px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Tỷ trọng sản phẩm xuất kho
      </Typography>
      <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} height={250} />
    </Box>
  );
};

export default ProductDistributionPieChart;
