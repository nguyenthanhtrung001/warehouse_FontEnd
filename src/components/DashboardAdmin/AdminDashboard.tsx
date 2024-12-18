"use client";
import React, { useEffect, useState } from "react";
import { Card, Grid, Box, Avatar, Typography } from "@mui/material";
import { Statistic, Row, Col } from "antd";
import {
  FaDollarSign,
  FaBoxes,
  FaShoppingCart,
  FaUsers,
  FaUserFriends,
  FaWarehouse,
  FaTruck,
} from "react-icons/fa";
import axios from "@/utils/axiosInstance";
import RevenueBarChart from "./RevenueBarChart";
import ProductDistributionPieChart from "./ProductDistributionPieChart";
import SalesTrendLineChart from "./SalesTrendLineChart";

const AdminDashboard = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderSummary, setOrderSummary] = useState({
    totalReceipts: 0,
    totalPurchasePrice: 0,
  });
  const [employeeCount, setEmployeeCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [deliverySummaryType2, setDeliverySummaryType2] = useState({
    totalDeliveryNotes: 0,
    totalQuantity: 0,
  });
  const [deliverySummaryType1, setDeliverySummaryType1] = useState({
    totalDeliveryNotes: 0,
    totalQuantity: 0,
  });
  const [deliverySummaryType3, setDeliverySummaryType3] = useState({
    totalDeliveryNotes: 0,
    totalQuantity: 0,
  });
  useEffect(() => {
    axios
      .get(
        "http://localhost:8888/v1/api/return-notes/revenue-warehouse/monthly",
      )
      .then((response) => {
        setMonthlyRevenue(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monthly revenue:", error);
      });

    axios
      .get("http://localhost:8888/v1/api/products/count")
      .then((response) => {
        setProductCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product count:", error);
      });

    axios
      .get("http://localhost:8888/v1/api/receipts/summary")
      .then((response) => {
        setOrderSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order summary:", error);
      });
    // Fetch employee count
    axios
      .get("http://localhost:8888/v1/api/employees")
      .then((response) => {
        setEmployeeCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching employee count:", error);
      });

    // Fetch customer count
    axios
      .get("http://localhost:8888/v1/api/customers")
      .then((response) => {
        setCustomerCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching customer count:", error);
      });

    // Fetch supplier count
    axios
      .get("http://localhost:8888/v1/api/suppliers")
      .then((response) => {
        setSupplierCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching supplier count:", error);
      });
    // Fetch delivery summary
    axios
      .get(
        "http://localhost:8888/v1/api/deliveryNotes/delivery-summary?type=2&status=1",
      )
      .then((response) => {
        if (response.data.success) {
          console.log("data: ", response.data.data);
          setDeliverySummaryType2(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery summary:", error);
      });

    // Fetch delivery summary
    axios
      .get(
        "http://localhost:8888/v1/api/deliveryNotes/delivery-summary?type=1&status=1",
      )
      .then((response) => {
        if (response.data.success) {
          console.log("data: ", response.data.data);
          setDeliverySummaryType1(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery summary:", error);
      });
      axios
      .get(
        "http://localhost:8888/v1/api/deliveryNotes/delivery-summary?type=3&status=2",
      )
      .then((response) => {
        if (response.data.success) {
         
          setDeliverySummaryType3(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery summary:", error);
      });
  }, []);

  return (
    <Box
      sx={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Bảng điều khiển quản trị - Quản lý kho hàng
      </Typography>

      {/* Cards Tổng quan */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#e1f5fe",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#1e88e5" }}>
                  <FaDollarSign color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={ <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    Xuất kho tháng này
                  </Typography>}
                  value={`${monthlyRevenue.toLocaleString()} VND`}
                />
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#c8e6c9",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#43a047" }}>
                  <FaBoxes color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={ <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    Tổng sản phẩm
                  </Typography>}
                  value={`${productCount.toLocaleString()} Sản phẩm`}
                />
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#fff9c4",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#fb8c00" }}>
                  <FaShoppingCart color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={ <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    Nhập hàng tháng này
                  </Typography>}
                  value={`${orderSummary.totalPurchasePrice.toLocaleString()} VND`}
                />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Số lượng:{" "}
                  {`${orderSummary.totalReceipts.toLocaleString()} Phiếu nhập`}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
      </Grid>

      {/* Card - Tổng phiếu giao hàng */}
      <Grid container spacing={3} mt={0}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#e1bee7",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#9c27b0" }}>
                  <FaTruck color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={ <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                   Xuất Hủy
                  </Typography>}
                  value={`${deliverySummaryType2.totalDeliveryNotes.toLocaleString()}`}
                />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Số Lượng:{" "}
                  {`${deliverySummaryType2.totalQuantity.toLocaleString()}`}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#ffccbc",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#9c27b0" }}>
                  <FaTruck color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={ <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                   Xuất trả nhà cung cấp
                  </Typography>}
                  value={`${deliverySummaryType1.totalDeliveryNotes.toLocaleString()}`}
                />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Số Lượng:{" "}
                  {`${deliverySummaryType1.totalQuantity.toLocaleString()}`}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#bcc3ff",
              padding: "20px",
              height: "140px",
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#9c27b0" }}>
                  <FaTruck color="white" />
                </Avatar>
              </Col>
              <Col flex="auto" style={{ paddingLeft: "12px" }}>
                <Statistic
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      Chuyển kho
                    </Typography>
                  }
                  value={`${deliverySummaryType3.totalDeliveryNotes.toLocaleString()}`}
                />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Số Lượng:{" "}
                  {`${deliverySummaryType3.totalQuantity.toLocaleString()}`}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
      </Grid>

      {/* Cards Số lượng nhân viên, khách hàng, nhà cung cấp */}
      <Grid container spacing={3} mt={0}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#f1f8e9",
              padding: "20px",
              height: "160px",
              boxShadow: 2,
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#4caf50", width: 56, height: 56 }}>
                  <FaUsers color="white" />
                </Avatar>
              </Col>
              <Col>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Nhân viên
                </Typography>
                <Typography variant="h5" sx={{ color: "#333" }}>
                  {employeeCount}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#e8f5e9",
              padding: "20px",
              height: "160px",
              boxShadow: 2,
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#388e3c", width: 56, height: 56 }}>
                  <FaUserFriends color="white" />
                </Avatar>
              </Col>
              <Col>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Khách hàng
                </Typography>
                <Typography variant="h5" sx={{ color: "#333" }}>
                  {customerCount}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: "#fff8e1",
              padding: "20px",
              height: "160px",
              boxShadow: 2,
              ":hover": { boxShadow: 6 },
            }}
          >
            <Row align="middle" style={{ height: "100%" }}>
              <Col>
                <Avatar sx={{ bgcolor: "#ffb300", width: 56, height: 56 }}>
                  <FaWarehouse color="white" />
                </Avatar>
              </Col>
              <Col>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Nhà cung cấp
                </Typography>
                <Typography variant="h5" sx={{ color: "#333" }}>
                  {supplierCount}
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
