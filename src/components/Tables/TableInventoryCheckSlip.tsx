"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/axiosInstance';
import SearchInput from '@/components/Search/SearchInputProps';
import DateFilter from '@/components/Search/DateFilter';
import CheckboxTwo from '@/components/Checkboxes/CheckboxTwo';
import Link from 'next/link';
import API_ROUTES from '@/utils/apiRoutes'; // Import API_ROUTES
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { useEmployeeStore } from '@/stores/employeeStore';
import { handlePrintPDF } from '../PDF/chkInventory_PDF';



const TableReceipt = () => {
  const [checkInventories, setCheckInventories] = useState<any[]>([]);
  const [selectedCheckInventory, setSelectedCheckInventory] = useState<any | null>(null);
  const [checkInventoryDetails, setCheckInventoryDetails] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { employee } = useEmployeeStore();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số mục trên mỗi trang
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  
  const fetchCheckInventories = useCallback(async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const response = await axios.get(API_ROUTES.INVENTORY_CHECK_SLIPS_WAREHOUSE(employee?.warehouseId));
      const checkInventoryList = response.data
        .filter((item: any) => {
          const checkDate = new Date(item.inventoryCheckTime);
          const searchLower = searchTerm.toLowerCase();
          return (
            (!startDate || checkDate >= startDate) &&
            (!endDate || checkDate <= endDate) &&
            (item.id.toString().includes(searchTerm) || searchLower === '' || item.notes.toLowerCase().includes(searchLower))
          );
        })
        .map((item: any) => ({
          id: item.id,
          dateCheck: new Date(item.inventoryCheckTime),
          dateBalance: new Date(item.inventoryBalancingDate),
          total: item.totalDiscrepancy,
          quantityIncrease: item.quantityDiscrepancyIncrease,
          quantityDecrease: item.quantityDiscrepancyDecrease,
          employee: item.employeeId,
          notes: item.notes,
          status: item.status === 1 ? "Hoàn tất" : "Đã hủy",
        }))
        .sort((a: { dateCheck: { getTime: () => number; }; }, b: { dateCheck: { getTime: () => number; }; }) => b.dateCheck.getTime() - a.dateCheck.getTime());  // Sort by latest date
  
      setTotalPages(Math.ceil(checkInventoryList.length / itemsPerPage)); // Update total pages
      setCheckInventories(checkInventoryList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)); // Only show items for the current page
    } catch (error) {
      console.error("Error fetching check inventories: ", error);
    }
  }, [startDate, endDate, searchTerm, employee, currentPage, itemsPerPage]);
  
  const handleCheckInventoryClick = async (checkInventory: any) => {
    try {
      if (selectedCheckInventory && selectedCheckInventory.id === checkInventory.id) {
        setSelectedCheckInventory(null);
        setCheckInventoryDetails([]);
      } else {
        const response = await axios.get(`${API_ROUTES.INVENTORY_CHECK_SLIPS}/details/${checkInventory.id}`);
        setCheckInventoryDetails(response.data);
        setSelectedCheckInventory(checkInventory);
      }
    } catch (error) {
      console.error("Error fetching check inventory details: ", error);
    }
  };
  useEffect(() => {
    fetchCheckInventories();
  }, [employee, startDate, endDate, searchTerm, currentPage, fetchCheckInventories]);
  
  const handleCancelCheckInventory = async (id: number) => {
    const result = await Swal.fire({
      title: 'Bạn  chắc chắn muốn hủy?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, hủy nó!',
      cancelButtonText: 'Không, giữ lại',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_ROUTES.INVENTORY_CHECK_SLIPS}/${id}`);
        Swal.fire('Đã hủy!', 'Phiếu kiểm đã được hủy.', 'success');
        fetchCheckInventories(); // Cập nhật lại danh sách sau khi hủy
      } catch (error) {
        console.error('Error canceling check inventory: ', error);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi hủy phiếu kiểm.', 'error');
      }
    }
  };
  const totalQuantity = checkInventoryDetails.reduce((acc, detail) => {
    if (detail.quantityDiscrepancy > 0) {
      return acc + detail.quantityDiscrepancy;
    }
    return acc;
  }, 0);
  const totalQuantityDe = checkInventoryDetails.reduce((acc, detail) => {
    if (detail.quantityDiscrepancy < 0) {
      return acc + detail.quantityDiscrepancy;
    }
    return acc;
  }, 0);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
      <div className="grid grid-cols-12">
          <div className="col-span-3">
            <h4 className="text-3xl font-semibold text-black dark:text-white ">
              KIỂM KHO 
            </h4>
          </div>
          <div className="col-span-5 flex items-center">
            <SearchInput 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              placeholder="Nhập mã kiểm kho hoặc ghi chú" 
            />
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-3 px-2 font-bold">
          <Link href="/inventorycheckslip/add">
            <button className="bg-green-600 text-white px-4 py-2 rounded">Tạo phiếu kiểm</button>
          </Link>  
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div>  </div>

        <div className="grid grid-cols-12 py-2">
        <div className="col-span-12 mb-4 ml-4">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            fetchInvoices={fetchCheckInventories}
          />
        </div>
      </div>

      <div className="container mx-auto mb-1">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-200 text-white bg-blue-700 font-bold">
          <div className="col-span-2  ml-6">Mã kiểm kho</div>
          <div className="col-span-2 ">Ngày kiểm kho</div>
          <div className="col-span-2 ">Ngày cân bằng</div>
          <div className="col-span-1 ">Tổng chênh lệch</div>
          <div className="col-span-1 ">SL lệch tăng</div>
          <div className="col-span-1 ">SL lệch giảm</div>
          <div className="col-span-2 ">Ghi chú</div>
          <div className="col-span-1 ">Trạng thái</div>
        </div>
      </div>

      {checkInventories.map((checkInventory) => (
        <React.Fragment key={checkInventory.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 p-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center" onClick={() => handleCheckInventoryClick(checkInventory)}>
                <CheckboxTwo />
                <p className="text-sm text-black dark:text-white mr-3 text-blue-700 font-bold">PKH000{checkInventory.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">
                {format(checkInventory.dateCheck, 'dd/MM/yyyy - HH:mm:ss')} 
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">
                {format(checkInventory.dateBalance, 'dd/MM/yyyy - HH:mm:ss')}
                  </p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-black dark:text-white mt-2">{checkInventory.total}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-black dark:text-white mt-2">{checkInventory.quantityIncrease}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-black dark:text-white mt-2">{checkInventory.quantityDecrease}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-black dark:text-white mt-2">{checkInventory.notes}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-meta-3">{checkInventory.status} </p>
              </div>
            </div>
          </div>
          {selectedCheckInventory && selectedCheckInventory.id === checkInventory.id && (
            <div className="px-4 py-4.5 border border-blue-500 dark:border-strokedark md:px-6 2xl:px-7.5 text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="mb-2 block font-medium text-blue-500 dark:text-white text-3xl py-2">
                      Thông tin
                    </label>
                    <ul className="list-none p-2">
                      <li className="mb-2 border-b border-gray-300 pb-2">Mã kiểm kho: <span className="font-bold text-blue-700">PKH000{selectedCheckInventory.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Kiểm kho: 
                        <span className="font-bold">
                        {format(selectedCheckInventory.dateCheck, 'dd/MM/yyyy - HH:mm:ss')}                        </span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Cân bằng kho: 
                        <span className="font-bold">
                        {format(selectedCheckInventory.dateBalance, 'dd/MM/yyyy - HH:mm:ss')}                          </span></li>
                  
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-15">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Trạng thái: <span className="font-bold text-blue-500">{checkInventory.status}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Người kiểm kho: <span className="font-bold">NV000{checkInventory.employee}</span></li>
                      {/* <li className="mb-2 border-b border-gray-300 pb-2">Trạng thái: <span className="font-bold">{checkInventory.status}</span></li> */}
                    </ul>
                  </div>
                  <div className="col-span-4 p-2 mt-12">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Ghi chú
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Đã cân bằng kho"
                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="container mx-auto border  border-blue-700 bg-blue-50 ">
                  <div className="grid grid-cols-12 gap-4 border  border-stroke py-4.5 bg-blue-600 font-bold text-white">
                    <div className="col-span-4 ml-6 ">Mã mặt hàng</div>
                    <div className="col-span-2 ">Lô hàng</div>
                    <div className="col-span-2 ">Số lượng trong kho</div>
                    <div className="col-span-2 ">Số lượng thực tế</div>
                    <div className="col-span-2 ">chênh lệch</div>
                  </div>

                  {checkInventoryDetails.map((detail) => (

                    <div  key={detail.batchDetail.id} className="grid grid-cols-12 gap-4 py-2 border-b border-stroke">
                      <div className="col-span-4 px-6 text-blue-500 font-bold">MMH000{detail.productId}</div>
                      <div className="col-span-2">{detail.batchDetail.batch.batchName}</div>
                      <div className="col-span-2">{detail.inventory}</div>
                      <div className="col-span-2">{detail.actualQuantity}</div>
                      <div className="col-span-2">{detail.quantityDiscrepancy}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-12 mt-3 py-2">
                    <div className="col-span-9"></div>
                    <div className="col-span-3">
                      <ul className="list-none p-0">
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng lệch tăng: <span className="font-bold ml-3">{totalQuantity}</span></li>
                        <li className="mb-2 border-b border-gray-300 pb-2">Tổng lệch giảm: <span className="font-bold ml-3">{totalQuantityDe}</span></li>
            
                      </ul>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-12 mt-3 py-6">
                  <div className="col-span-8"></div>
                  <div className="col-span-4 px-2 flex justify-end">
                    <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">Mở phiếu</button>
             
                    <button
                      className="bg-red text-white px-4 py-2 rounded"
                      onClick={() => handleCancelCheckInventory(checkInventory.id)}
                    >
                      Hủy
                    </button>
                    <button
                      className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
                      onClick={() => handlePrintPDF(checkInventory, checkInventoryDetails)} // Gọi hàm in PDF
                    >
                      In PDF
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </React.Fragment>
      ))}

<div className="flex justify-center mt-4">
  <button
    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Trước
  </button>
  
  <span className="px-4 py-2">{`Trang ${currentPage} / ${totalPages}`}</span>
  
  <button
    className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Sau
  </button>
</div>

    </div>
    
  );
};

export default TableReceipt;
