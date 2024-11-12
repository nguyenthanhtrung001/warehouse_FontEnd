"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchForecastData, trainModel } from '@/utils/api'; // Import các hàm API đã tạo

// Định nghĩa kiểu dữ liệu dự báo
type ForecastResult = {
  itemId: string;
  forecastTimestamp: string;
  forecastValue: number;
  standardError: number;
  confidenceIntervalLowerBound: number;
  confidenceIntervalUpperBound: number;
};

// Hàm chuyển đổi từ chuỗi thời gian sang định dạng dd/MM/yyyy HH:mm:ss
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp); // Chuyển đổi chuỗi thành đối tượng Date
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Giao diện chính
const ForecastPage = () => {
  const [forecastData, setForecastData] = useState<ForecastResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm để gọi API và lấy kết quả dự báo
  const loadForecastData = async () => {
    setLoading(true);
    const data = await fetchForecastData();
    setForecastData(data);
    setLoading(false);
  };

  // Hàm để train lại mô hình
  const handleTrainModel = async () => {
    setLoading(true);
    await trainModel();
    await loadForecastData(); // Cập nhật dữ liệu sau khi train
    setLoading(false);
  };

  useEffect(() => {
    loadForecastData(); // Tải dữ liệu dự báo khi component được render lần đầu
  }, []);

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: 'ID Sản phẩm',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: 'Thời gian dự đoán',
      dataIndex: 'forecastTimestamp',
      key: 'forecastTimestamp',
      render: (text: string) => formatTimestamp(text), // Sử dụng formatTimestamp để hiển thị thời gian
    },
    {
      title: 'Giá trị dự đoán',
      dataIndex: 'forecastValue',
      key: 'forecastValue',
    },
    {
      title: 'Sai số tiêu chuẩn',
      dataIndex: 'standardError',
      key: 'standardError',
    },
    {
      title: 'Khoảng tin cậy dưới',
      dataIndex: 'confidenceIntervalLowerBound',
      key: 'confidenceIntervalLowerBound',
    },
    {
      title: 'Khoảng tin cậy trên',
      dataIndex: 'confidenceIntervalUpperBound',
      key: 'confidenceIntervalUpperBound',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dự báo nhu cầu</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="primary" onClick={handleTrainModel} loading={loading}>
            Train lại mô hình
          </Button>
        </Col>

        <Col span={24}>
          <Card title="Bảng dự báo">
            <Table
              dataSource={forecastData}
              columns={columns}
              rowKey={(record) => `${record.itemId}-${record.forecastTimestamp}`}
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Biểu đồ dự báo">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={forecastData.map((d) => ({
                  ...d,
                  forecastTimestamp: formatTimestamp(d.forecastTimestamp), // Chuyển đổi chuỗi thành định dạng thời gian
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="forecastTimestamp" />
                <YAxis 
                  tickCount={10} // Thiết lập số lượng giá trị hiển thị trên trục Y
                />
                <Tooltip formatter={(value) => value.toLocaleString('vi-VN')} />
                <Legend />
                <Line type="monotone" dataKey="forecastValue" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="confidenceIntervalLowerBound" stroke="#82ca9d" />
                <Line type="monotone" dataKey="confidenceIntervalUpperBound" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForecastPage;
