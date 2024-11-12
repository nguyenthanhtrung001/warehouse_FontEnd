"use client";
import React, { useEffect, useState } from 'react';
import { Card, Grid, Box, Avatar, Typography } from '@mui/material';
import { Statistic, Row, Col } from 'antd';
import { FaDollarSign, FaBoxes, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import RevenueBarChart from './RevenueBarChart';
import ProductDistributionPieChart from './ProductDistributionPieChart';
import SalesTrendLineChart from './SalesTrendLineChart';

const AdminDashboard = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderSummary, setOrderSummary] = useState({ totalReceipts: 0, totalPurchasePrice: 0 });

  useEffect(() => {
    axios.get('http://localhost:8888/v1/api/return-notes/revenue-warehouse/monthly')
      .then((response) => {
        setMonthlyRevenue(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monthly revenue:", error);
      });

    axios.get('http://localhost:8888/v1/api/products/count')
      .then((response) => {
        setProductCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product count:", error);
      });

    axios.get('http://localhost:8888/v1/api/receipts/summary')
      .then((response) => {
        setOrderSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order summary:", error);
      });
  }, []);

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Bảng điều khiển quản trị - Quản lý kho hàng
      </Typography>

      {/* Cards Tổng quan */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e3f2fd', padding: '20px', height: '140px' }}>
            <Row align="middle" style={{ height: '100%' }}>
              <Col>
                <Avatar sx={{ bgcolor: '#1e88e5' }}>
                  <FaDollarSign color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: '12px' }}>
                <Statistic 
                  title="Doanh thu tháng này" 
                  value={`${monthlyRevenue.toLocaleString()} VND`} 
                />
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e8f5e9', padding: '20px', height: '140px' }}>
            <Row align="middle" style={{ height: '100%' }}>
              <Col>
                <Avatar sx={{ bgcolor: '#43a047' }}>
                  <FaBoxes color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: '12px' }}>
                <Statistic 
                  title="Tổng sản phẩm" 
                  value={`${productCount.toLocaleString()} Sản phẩm`} 
                />
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#fff3e0', padding: '20px', height: '140px' }}>
            <Row align="middle" style={{ height: '100%' }}>
              <Col>
                <Avatar sx={{ bgcolor: '#fb8c00' }}>
                  <FaShoppingCart color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: '12px' }}>
                <Statistic 
                  title="Nhập hàng tháng này" 
                  value={`${orderSummary.totalPurchasePrice.toLocaleString()} VND`}
                />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Số lượng: {`${orderSummary.totalReceipts.toLocaleString()} Phiếu nhập`}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ cột - Doanh thu theo chi nhánh */}
      <Box mt={5}>
        <RevenueBarChart />
      </Box>

      {/* Biểu đồ tròn và xu hướng trong cùng một hàng */}
      <Grid container spacing={3} mt={5}>
        <Grid item xs={12} sm={6}>
          <ProductDistributionPieChart />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SalesTrendLineChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
