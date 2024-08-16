// components/report/MonthYearSelector.tsx
import React from 'react';

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({ month, year, onMonthChange, onYearChange }) => {
  return (
    <div>
      <label>
        Tháng:
        <select value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label>
        Năm:
        <select value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => 2023 + i).map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MonthYearSelector;
