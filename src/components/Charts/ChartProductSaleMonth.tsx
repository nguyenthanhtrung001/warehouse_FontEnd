// components/ProductQuantityPieChart.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Product {
  productId: number;
  quantity: number;
}

interface ProductQuantityPieChartProps {
  month: number;
  year: number;
}

const ProductQuantityPieChart: React.FC<ProductQuantityPieChartProps> = ({ month, year }) => {
    
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Product[]>(
          'http://localhost:8888/v1/api/invoice-details/products/quantities/by-month-year',
          {
            params: { month, year }
          }
        );
        setData(response.data); // Cập nhật dữ liệu
        setLoading(false); // Dữ liệu đã tải
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi lấy dữ liệu.');
        setLoading(false); // Dữ liệu đã tải dù có lỗi
      }
    };

    fetchData();
  }, [month, year]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: data.map(item => `MH000${item.productId}`),
    title: {
      text: `Thống kê sản phẩm bán ra tháng ${month} năm ${year}`,
      align: 'left'
      
    },
    legend: {
      position: 'bottom',
    }
  };

  const chartSeries = data.map(item => item.quantity);

  return (
    <div className='text-black col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5'>
      <ReactApexChart options={chartOptions} series={chartSeries} type="pie" height={350} />
    </div>
  );
};

export default ProductQuantityPieChart;
