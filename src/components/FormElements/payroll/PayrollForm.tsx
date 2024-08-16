import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import API_ROUTES from '@/utils/apiRoutes';
import { Payroll } from '@/types/payroll';
import Swal from 'sweetalert2';

interface PayrollFormProps {
  payrollId: number;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ payrollId }) => {
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [error, setError] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await axios.get<Payroll>(`http://localhost:8888/v1/api/payrolls/${payrollId}`);
        const payrollData = response.data;

        if (payrollData) {
          const updatedPayroll: Payroll = {
            ...payrollData,
            workingPeriod: payrollData.working_period,
          };

          setPayroll(updatedPayroll);
        } else {
          console.error('Dữ liệu payrollData là null hoặc undefined');
        }

        setError('');
      } catch (error) {
        console.error('Lỗi khi lấy thông tin payroll:', error);
        setError('Lỗi khi lấy thông tin payroll');
      }
    };

    fetchPayroll();
  }, [payrollId]);

  const calculateTotalSalary = (income: number, bonus: number, deduction: number) => {
    return income + bonus - deduction;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (payroll) {
      const { name, value } = e.target;
      const newValue = name === 'bonus' || name === 'totalIncome' || name === 'deduction'
        ? parseFloat(value) || 0
        : value;

      const updatedPayroll = {
        ...payroll,
        [name]: newValue,
      };

      // Tính toán lại tổng lương
      updatedPayroll.totalSalary = calculateTotalSalary(
        updatedPayroll.totalIncome,
        updatedPayroll.bonus,
        updatedPayroll.deduction
      );

      setPayroll(updatedPayroll);
    }
  };

  const handleUpdate = async () => {
    if (!payroll) return;

    try {
      setIsUpdating(true);

      // Hiển thị hộp thoại xác nhận trước khi cập nhật
      const result = await Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn cập nhật thông tin này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, cập nhật!',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        console.log('Dữ liệu payroll trước khi gửi:', JSON.stringify(payroll, null, 2));

        await axios.put(`http://localhost:8888/v1/api/payrolls/${payroll.id}`, payroll);
        
        Swal.fire(
          'Thành công!',
          'Thông tin payroll đã được cập nhật.',
          'success'
        );
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật payroll:', error);
      setError('Lỗi khi cập nhật payroll');
      Swal.fire(
        'Thất bại!',
        'Đã xảy ra lỗi khi cập nhật thông tin payroll.',
        'error'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!payroll) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-lg text-xl">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="namePayroll" className="block text-sm font-medium text-blue-800">Tên Payroll</label>
          <input
            type="text"
            id="namePayroll"
            name="namePayroll"
            value={payroll.namePayroll || ''}
            disabled
            onChange={handleChange}
            className=" p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div>
          <label htmlFor="workingPeriod" className="block text-sm font-medium text-blue-800">Thời gian làm việc</label>
          <input
            type="text"
            id="workingPeriod"
            name="workingPeriod"
            disabled
            value={payroll.workingPeriod || ''}
            onChange={handleChange}
            className=" p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div>
          <label htmlFor="bonus" className="block text-sm font-medium text-blue-800">Tiền thưởng</label>
          <input
            type="number"
            id="bonus"
            name="bonus"
            value={payroll.bonus || ''}
            onChange={handleChange}
            className="p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div>
          <label htmlFor="totalIncome" className="block text-sm font-medium text-blue-800">Tổng thu nhập</label>
          <input
            type="number"
            id="totalIncome"
            name="totalIncome"
            disabled
            value={payroll.totalIncome || ''}
            onChange={handleChange}
            className="p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div>
          <label htmlFor="deduction" className="block text-sm font-medium text-blue-800">Khấu trừ</label>
          <input
            type="number"
            id="deduction"
            name="deduction"
            value={payroll.deduction || ''}
            onChange={handleChange}
            className=" p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div>
          <label htmlFor="totalSalary" className="block text-sm font-medium text-blue-800">Tổng lương</label>
          <input
            type="number"
            id="totalSalary"
            name="totalSalary"
            value={payroll.totalSalary || ''}
            disabled
            onChange={handleChange}
            className="p-1 mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="note" className="block text-sm font-medium text-blue-800">Ghi chú</label>
          <textarea
            id="note"
            name="note"
            value={payroll.note || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="col-span-2 w-full py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default PayrollForm;
