"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Progress } from "antd";
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
import { fetchForecastData, trainModel } from "@/utils/api";
import { ForecastResult, ItemForecast } from "@/types/predict";

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

const ForecastPage = () => {
  const [forecastResults, setForecastResults] = useState<ForecastResult[]>([]);
  const [itemForecasts, setItemForecasts] = useState<ItemForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");

  // Hàm tải dữ liệu (không train)
  const loadInitialData = async () => {
    setLoading(true);
    setProgress(50);
    setStatusMessage("Đang tải dữ liệu dự báo...");
    try {
      const { forecastResults, itemForecasts } = await fetchForecastData();
      setForecastResults(forecastResults);
      setItemForecasts(itemForecasts);

      // Xác định khoảng thời gian dự đoán
      if (forecastResults.length > 0) {
        const dates = forecastResults.map(
          (res) => new Date(res.forecastTimestamp)
        );
        
        const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      
        // Lấy ngày mà không có thời gian
        const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");
      
        setDateRange(
          `${formatDate(startDate)} - ${formatDate(endDate)}`
        );
      }
      

      setProgress(100);
      setStatusMessage("Dữ liệu đã được tải xong.");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setStatusMessage("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải lại dữ liệu sau khi train
  const reloadDataAfterTrain = async () => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("");

    try {
      // Bước 1: Train dữ liệu
      setProgress(25);
      setStatusMessage("Đang lấy dữ liệu...");
      await trainModel();

      setProgress(50);
      setStatusMessage("Train dữ liệu thành công!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Bước 2: Lấy dữ liệu dự báo
      setProgress(75);
      setStatusMessage("Đang tải dữ liệu dự báo...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { forecastResults, itemForecasts } = await fetchForecastData();
      setForecastResults(forecastResults);
      setItemForecasts(itemForecasts);

      // Xác định khoảng thời gian dự đoán
      if (forecastResults.length > 0) {
        const dates = forecastResults.map(
          (res) => new Date(res.forecastTimestamp),
        );
        const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));
        setDateRange(
          `${formatTimestamp(startDate.toISOString())} - ${formatTimestamp(endDate.toISOString())}`,
        );
      }

      setProgress(100);
      setStatusMessage("Dữ liệu đã được tải lại thành công!");
    } catch (error) {
      console.error("Lỗi khi tải lại dữ liệu:", error);
      setStatusMessage("Không thể tải lại dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi tải dữ liệu lần đầu khi trang được tải
  useEffect(() => {
    loadInitialData();
  }, []);

  const forecastColumns = [
    {
      title: "ID Sản phẩm",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Thời gian dự đoán",
      dataIndex: "forecastTimestamp",
      key: "forecastTimestamp",
      render: (text: string) => formatTimestamp(text),
    },
    {
      title: "Giá trị dự đoán",
      dataIndex: "forecastValue",
      key: "forecastValue",
    },
    {
      title: "Sai số tiêu chuẩn",
      dataIndex: "standardError",
      key: "standardError",
    },
    {
      title: "Khoảng tin cậy dưới",
      dataIndex: "confidenceIntervalLowerBound",
      key: "confidenceIntervalLowerBound",
    },
    {
      title: "Khoảng tin cậy trên",
      dataIndex: "confidenceIntervalUpperBound",
      key: "confidenceIntervalUpperBound",
    },
  ];

  const itemForecastColumns = [
    {
      title: "ID Sản phẩm",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Giá trị dự đoán",
      dataIndex: "forecastValue",
      key: "forecastValue",
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      title: "Khuyến nghị",
      key: "recommendation",
      render: (_: any, record: ItemForecast) => {
        const difference = record.forecastValue - record.inventory;
        return difference > 0 ? (
          <span style={{ color: "red" }}>Khuyến nghị nhập {difference}</span>
        ) : (
          <span style={{ color: "green" }}>Không cần nhập</span>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-gray-900 mb-2 text-right text-3xl font-extrabold">
        Dự báo nhu cầu
      </h1>
      <h3 className="text-gray-700 text-right text-xl">
        Kết quả dự đoán từ ngày:{" "}
        <span className="font-bold text-green-600">{dateRange}</span>
      </h3>

      <Row gutter={[16, 16]}>
        <Col span={2}>
          <Button
            type="dashed"
            onClick={reloadDataAfterTrain}
            loading={loading}
            className="rounded-lg border-2 border-green-500 px-6 py-2 font-bold text-green-700 transition-all duration-300 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="font-bold text-green-700">
              Train và Tải lại dữ liệu
            </span>
          </Button>
        </Col>

        {loading && (
          <Col span={24} style={{ marginTop: 20 }}>
            <Progress percent={progress} />
            <div
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {statusMessage}
            </div>
          </Col>
        )}

        {/* Bảng thông tin sản phẩm */}
        <Col span={24}>
          <Card title="Thông tin sản phẩm">
            <Table
              dataSource={itemForecasts}
              columns={itemForecastColumns}
              rowKey={(record) => record.itemId}
              pagination={{ pageSize: 5 }}
              loading={loading}
              bordered
            />
          </Card>
        </Col>

        {/* Bảng dự báo chi tiết */}
        <Col span={24}>
          <Card title="Chi tiết dự báo">
            <Table
              dataSource={forecastResults}
              columns={forecastColumns}
              rowKey={(record) =>
                `${record.itemId}-${record.forecastTimestamp}`
              }
              pagination={{ pageSize: 5 }}
              loading={loading}
              bordered
            />
          </Card>
        </Col>

        {/* Biểu đồ dự báo */}
        <Col span={24}>
          <Card title="Biểu đồ dự báo">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />

                {/* Trục X: Thời gian */}
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={[
                    Date.now(), // Ngày hiện tại
                    forecastResults.length > 0
                      ? Math.max(
                          ...forecastResults.map((res) =>
                            new Date(res.forecastTimestamp).getTime(),
                          ),
                        )
                      : Date.now(), // Nếu không có dữ liệu, sử dụng ngày hiện tại làm mốc cuối
                  ]}
                  tickFormatter={(tick) =>
                    new Date(tick).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                  label={{
                    value: "Thời gian dự đoán",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                {/* Trục Y */}
                <YAxis
                  label={{
                    value: "Giá trị dự báo",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                {/* Tooltip */}
                <Tooltip
                  labelFormatter={(label) =>
                    new Date(label).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />

                {/* Huyền thoại */}
                <Legend />

                {/* Dữ liệu nhóm theo itemId */}
                {Object.entries(
                  forecastResults.reduce(
                    (acc, curr) => {
                      const itemData = acc[curr.itemId] || [];
                      return {
                        ...acc,
                        [curr.itemId]: [
                          ...itemData,
                          {
                            ...curr,
                            timestamp: new Date(
                              curr.forecastTimestamp,
                            ).getTime(),
                          },
                        ],
                      };
                    },
                    {} as Record<string, ForecastResult[]>,
                  ),
                ).map(([itemId, data]) => {
                  // Sắp xếp dữ liệu theo thời gian
                  const sortedData = [...data].sort(
                    (a, b) => a.timestamp - b.timestamp,
                  );

                  return (
                    <Line
                      key={itemId}
                      data={sortedData}
                      type="monotone"
                      dataKey="forecastValue"
                      name={`Sản phẩm ${itemId}`}
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Màu ngẫu nhiên
                      dot={{ r: 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForecastPage;
