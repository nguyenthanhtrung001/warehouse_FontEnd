"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axiosInstance from "@/utils/axiosInstance";
import { ApexOptions } from "apexcharts";
import API_ROUTES from '@/utils/apiRoutes';
import { useEmployeeStore } from '@/stores/employeeStore';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Hàm để tạo màu ngẫu nhiên
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Hàm để tính độ tương phản giữa hai màu
function getContrast(color1: string, color2: string) {
  // Chuyển đổi màu hex sang RGB
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Tính toán độ tương phản
  const contrast =
    Math.sqrt(
      (r2 - r1) * (r2 - r1) +
      (g2 - g1) * (g2 - g1) +
      (b2 - b1) * (b2 - b1)
    );

  return contrast;
}

// Hàm để tạo một danh sách màu mà không giống nhau quá
function generateDistinctColors(numColors: number) {
  const colors: string[] = [];
  while (colors.length < numColors) {
    const newColor = getRandomColor();
    const isDistinct = colors.every(
      (color) => getContrast(color, newColor) > 100 // Ngưỡng độ tương phản tối thiểu
    );
    if (isDistinct) {
      colors.push(newColor);
    }
  }
  return colors;
}

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: generateDistinctColors(2),
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: generateDistinctColors(2),
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 200,
  },
};

const ChartProductSale12Month: React.FC = () => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!employee || !employee.warehouseId) {
        console.error("Employee data is not available.");
        return; // Dừng việc gọi API nếu employee không có hoặc warehouseId không tồn tại
      }

      try {
        const currentYear = new Date().getFullYear();
        const response = await axiosInstance.get(
          API_ROUTES.PRODUCT_SUMMARY_WAREHOUSE(currentYear, employee.warehouseId)
        );

        console.log("API Response:", response.data);

        const chartData = response.data.chartData;
        setSeries(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employee]); 

  return (
    <div className="mb-20 mt-2 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">

        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Xu hướng mặt hàng năm { new Date().getFullYear()} </p>
              
            </div>
          </div>
         
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Ngày
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Tháng
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Năm
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartProductSale12Month;
