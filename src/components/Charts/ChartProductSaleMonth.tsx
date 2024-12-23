// components/ProductQuantityPieChart.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useEmployeeStore } from '@/stores/employeeStore';
import API_ROUTES from '@/utils/apiRoutes';

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
  const { employee } = useEmployeeStore();
  const warehouseId = employee?.warehouseId;

  useEffect(() => {
    const fetchData = async () => {
      // Chờ employee và warehouseId sẵn sàng
      if (!employee || !warehouseId) return;
  
      try {
        const response = await axiosInstance.get<Product[]>(
          API_ROUTES.PRODUCT_QUANTITIES_BY_MONTH_YEAR(month, year, warehouseId)
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
  }, [month, year, warehouseId, employee]);
  
  


  if (loading) return <p>Đang tải dữ liệu..</p>;
  if (error) return <p>{error}</p>;

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: data.map(item => `MH000${item.productId}`),
    title: {
      text: `Thống kê sản phẩm xuất kho tháng ${month} năm ${year}`,
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
