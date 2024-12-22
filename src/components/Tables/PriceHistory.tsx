// components/PriceHistory.tsx

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { AiOutlineReload } from "react-icons/ai"; // Icon cho nút Reset
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icon cho pagination
import { BsCalendar, BsSearch } from "react-icons/bs"; // Icon cho search và date

interface PriceHistoryEntry {
  effectiveDate: string;
  productName: string;
  employeeId: number;
  newPrice: number;
}

const PriceHistory = () => {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PriceHistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:8888/v1/api/prices");
        const data = response.data.map((item: any) => ({
          id: item.id,
          effectiveDate: item.effectiveDate,
          productName: item.product.productName,
          employeeId: item.employeeId,
          newPrice: item.price,
        }));
        data.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
          setHistory(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error("Error fetching price history: ", error);
      }
    };

    fetchHistory();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterData(value, startDate, endDate);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);

    if (endDate && new Date(value) > new Date(endDate)) {
      setEndDate(value);
    }

    filterData(searchTerm, value, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!startDate || new Date(value) >= new Date(startDate)) {
      setEndDate(value);
      filterData(searchTerm, startDate, value);
    } else {
      alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
    }
  };

  const filterData = (term: string, start: string, end: string) => {
    const filtered = history.filter((entry) => {
      const entryDate = new Date(entry.effectiveDate);
      const matchesTerm = entry.productName.toLowerCase().includes(term);
      const matchesStartDate = start ? entryDate >= new Date(start) : true;
      const matchesEndDate = end ? entryDate <= new Date(end) : true;
      return matchesTerm && matchesStartDate && matchesEndDate;
    });
    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredHistory(history);
    setCurrentPage(1); // Reset to the first page
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="mt-4">
      {/* Search and Date Filters */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
        <div className="relative w-full md:w-1/3">
          <BsSearch className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Lọc theo tên sản phẩm"
            className="border rounded pl-10 pr-2 py-2 w-full"
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <BsCalendar className="absolute top-3 left-3 text-gray-500" />
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Ngày bắt đầu"
            className="border rounded pl-10 pr-2 py-2 w-full"
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <BsCalendar className="absolute top-3 left-3 text-gray-500" />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="Ngày kết thúc"
            className="border rounded pl-10 pr-2 py-2 w-full"
          />
        </div>
        <button
          onClick={handleReset}
          className="bg-red text-white flex items-center justify-center px-4 py-2 rounded md:ml-4 mt-2 md:mt-0"
        >
          <AiOutlineReload className="mr-2" /> Reset
        </button>
      </div>

      {/* Table */}
      {currentItems.length === 0 ? (
        <p>Không có lịch sử cập nhật giá.</p>
      ) : (
        <table className="w-full text-left border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Sản phẩm</th>
              <th className="px-4 py-2">Mã nhân viên</th>
              <th className="px-4 py-2">Giá mới</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((entry, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="px-4 py-2 border-t border-gray-200">
                  {new Date(entry.effectiveDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-2 border-t border-gray-200">
                  {entry.productName}
                </td>
                <td className="px-4 py-2 border-t border-gray-200">
                  {entry.employeeId}
                </td>
                <td className="px-4 py-2 border-t border-gray-200">
                  {entry.newPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          <FaChevronLeft className="mr-1" /> Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang sau <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PriceHistory;
