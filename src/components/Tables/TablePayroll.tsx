"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Payroll } from "@/types/payroll"; // Đảm bảo bạn đã định nghĩa kiểu dữ liệu cho bảng lương
import Modal from "@/components/Modal/Modal";
import FormAddPayroll from "@/components/FormElements/payroll/AddPayRoll"; // Đảm bảo có component thêm bảng lương
import { formatCurrency } from "@/utils/formatCurrency";
import axiosInstance from "@/utils/axiosInstance";
import PayrollForm from "@/components/FormElements/payroll/PayrollForm"; // Đảm bảo có component thêm bảng lương

const TablePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [detailedPayrolls, setDetailedPayrolls] = useState<Payroll[]>([]);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [showAddPayrollForm, setShowAddPayrollForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<number | null>(null); // Thêm state để quản lý ID bảng lương

  // Define fetchPayrolls as a function outside of useEffect
  const fetchPayrolls = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8888/v1/api/payrolls/group-by-working-period-status"
      );
      setPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching payrolls: ", error);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const fetchDetailedPayrolls = async (workingPeriod: string) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8888/v1/api/payrolls/working-period?workingPeriod=${encodeURIComponent(
          workingPeriod
        )}`
      );
      setDetailedPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching detailed payrolls: ", error);
    }
  };

  const handlePayrollClick = (payroll: Payroll) => {
    if (selectedPayroll && selectedPayroll.id === payroll.id) {
      setSelectedPayroll(null);
      setDetailedPayrolls([]); // Ẩn thông tin chi tiết
    } else {
      setSelectedPayroll(payroll);
      setSelectedPayrollId(payroll.id); // Cập nhật ID bảng lương được chọn
      fetchDetailedPayrolls(payroll.workingPeriod); // Gọi API để lấy chi tiết
    }
  };

  const handleCloseModal = () => {
    setShowAddPayrollForm(false);
    setShowPayrollForm(false);
    fetchPayrolls(); // Fetch payrolls again when modal is closed
    if (selectedPayroll) {
      fetchDetailedPayrolls(selectedPayroll.workingPeriod); // Fetch detailed payrolls again
    } else {
      setDetailedPayrolls([]); // Clear detailed payrolls if no selected payroll
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              BẢNG TÍNH LƯƠNG
            </h4>
          </div>
          <div className="col-span-3 px-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddPayrollForm(true)}
            >
              Thêm mới
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">
              In PDF
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isVisible={showAddPayrollForm}
        onClose={handleCloseModal}
        title="TẠO BẢNG TÍNH LƯƠNG"
      >
        <FormAddPayroll />
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold">
          <div className="col-span-3">Tên bảng lương</div>
          <div className="col-span-2">Kỳ làm việc</div>
          <div className="col-span-2 text-center">Kỳ hạn trả</div>
          <div className="col-span-2 text-center">Nhân viên</div>
          <div className="col-span-2">Tổng lương</div>
        </div>
      </div>

      {payrolls.map((payroll) => (
        <React.Fragment key={payroll.workingPeriod}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white font-bold">
                  {payroll.namePayroll}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white text-blue-500 font-bold">
                  {payroll.workingPeriod}
                </p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-sm text-black dark:text-white font-bold">
                  Hàng tháng
                </p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-sm text-black dark:text-white">
                  {payroll.count}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white">
                  {formatCurrency(payroll.totalSalarySum)}
                </p>
              </div>
              <div className="col-span-1">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handlePayrollClick(payroll)}
                >
                  Xem
                </button>
              </div>
            </div>
          </div>

          {selectedPayroll &&
            selectedPayroll.workingPeriod === payroll.workingPeriod && (
              <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5">
                <div className="container mx-auto px-4">
                  <div className="mb-10">
                    <h4 className="text-lg font-semibold text-black dark:text-white p-2 text">
                      Chi tiết bảng lương
                    </h4>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Tên nhân viên</th>
                          <th className="border border-gray-300 px-4 py-2">Lương cơ bản</th>
                          <th className="border border-gray-300 px-4 py-2">Thưởng</th>
                          <th className="border border-gray-300 px-4 py-2">Phạt</th>
                          <th className="border border-gray-300 px-4 py-2">Tổng lương</th>
                          <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
                          <th className="border border-gray-300 px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedPayrolls.map((detail) => (
                          <tr key={detail.id}>
                            <td className="border border-gray-300 px-4 py-2 text-blue-700 font-bold">
                              BH000{detail.id}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {detail.employee.employeeName}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {formatCurrency(detail.totalIncome)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {formatCurrency(detail.bonus)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {formatCurrency(detail.deduction)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {formatCurrency(detail.totalSalary)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className="text-red">{detail.note}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded"
                                onClick={() => {
                                  setShowPayrollForm(true);
                                  setSelectedPayrollId(detail.id);
                                }}
                              >
                                Tính lương
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
        </React.Fragment>
      ))}

      {/* Modal for Payroll Form */}
      <Modal
        isVisible={showPayrollForm}
        onClose={handleCloseModal}
        title="CẬP NHẬT BẢNG LƯƠNG"
      >
        {selectedPayrollId && <PayrollForm payrollId={selectedPayrollId} />}
      </Modal>
    </div>
  );
};

export default TablePayroll;
