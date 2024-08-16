// components/DateFilter.tsx
import React from 'react';

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  fetchInvoices: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fetchInvoices,
}) => {
  return (
    <div className="flex gap-4">
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Từ ngày</label>
        <input
          type="date"
          id="start-date"
          value={startDate ? startDate.toISOString().substring(0, 10) : ''}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Đến ngày</label>
        <input
          type="date"
          id="end-date"
          value={endDate ? endDate.toISOString().substring(0, 10) : ''}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          onClick={fetchInvoices}
          className="bg-blue-600 text-white px-6 py-2 rounded mt-6">
          Lọc
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
