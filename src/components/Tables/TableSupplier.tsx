"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Supplier } from '@/types/supplier';
import Modal from '@/components/Modal/Modal';
import FormAddSupplier from '@/components/FormElements/supplier/AddSupplierForm';
import FormUpdateSupplier from '@/components/FormElements/supplier/UpdateSupplierForm';
import API_ROUTES from '@/utils/apiRoutes'; // Import API routes từ cấu hình
import axiosInstance from '@/utils/axiosInstance';

const TableSupplier = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [showUpdateSupplierForm, setShowUpdateSupplierForm] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.SUPPLIERS);
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSupplierClick = (supplier: Supplier) => {
    if (selectedSupplier && selectedSupplier.id === supplier.id) {
      setSelectedSupplier(null);
    } else {
      setSelectedSupplier(supplier);
    }
  };

  const handleCloseModal = () => {
    setShowAddSupplierForm(false);
    setShowUpdateSupplierForm(false);
  };

  const handleUpdateClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowUpdateSupplierForm(true);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <h4 className="text-3xl font-semibold text-black dark:text-white">
              NHÀ CUNG CẤP
            </h4>
          </div>
          <div className="col-span-3 px-2 font-bold">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddSupplierForm(true)}
            >
              Thêm mới
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded ml-2">In PDF</button>
          </div>
        </div>
      </div>

      {/* Modal thêm nhà cung cấp */}
      <Modal isVisible={showAddSupplierForm} onClose={handleCloseModal} title="THÊM NHÀ CUNG CẤP">
        <FormAddSupplier />
      </Modal>

      {/* Modal cập nhật nhà cung cấp */}
      <Modal isVisible={showUpdateSupplierForm} onClose={handleCloseModal} title="CẬP NHẬT THÔNG TIN">
        <FormUpdateSupplier supplier={selectedSupplier} />
      </Modal>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 border-t border-stroke px-4 py-4.5 bg-blue-700 text-white font-bold">
          <div className="col-span-3 ">ID</div>
          <div className="col-span-3 ">Tên nhà cung cấp</div>
          <div className="col-span-3 ">Số điện thoại</div>
          <div className="col-span-3 ">Hành động</div>
        </div>
      </div>

      {suppliers.map((supplier) => (
        <React.Fragment key={supplier.id}>
          <div className="container mx-auto px-4 mb-1 border-b border-gray-200 py-2">
            <div className="grid grid-cols-12 gap-4 mt-1 ">
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white font-bold text-blue-500 ml-2">NCC000{supplier.id}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white">{supplier.supplierName}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-black dark:text-white">{supplier.phoneNumber}</p>
              </div>
              <div className="col-span-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleSupplierClick(supplier)}
                >
                  Xem
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => handleUpdateClick(supplier)}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          {selectedSupplier && selectedSupplier.id === supplier.id && (
            <div className="px-4 py-4.5 border border-blue-700 dark:border-strokedark md:px-6 2xl:px-7.5 bg-blue-50 text-black">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="mb-3 block font-bold p-2 text-blue-700 dark:text-white text-2xl">
                     {supplier.supplierName}
                    </label>
                    <ul className="list-none p-2">
                      <li className="mb-2 border-b border-gray-300 pb-2">ID: <span className="font-bold ml-2">NCC000{supplier.id}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Số điện thoại: <span className="font-bold ml-2">{supplier.phoneNumber}</span></li>
                    </ul>
                  </div>
                  <div className="col-span-6 p-2 mt-15">
                    <ul className="list-none p-0">
                      <li className="mb-2 border-b border-gray-300 pb-2">Địa chỉ: <span className="font-bold ml-2">{supplier.address}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Email: <span className="font-bold ml-2">{supplier.email}</span></li>
                      <li className="mb-2 border-b border-gray-300 pb-2">Ghi chú: <span className="font-bold ml-2">{supplier.note}</span></li>
                    </ul>
                  </div>
                </div>
                
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TableSupplier;
