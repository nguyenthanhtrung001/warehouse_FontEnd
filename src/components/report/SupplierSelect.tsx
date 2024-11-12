// src/components/SupplierSelect.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; // Import axios instance
import API_ROUTES from '@/utils/apiRoutes';

interface Supplier {
  id: number;
  supplierName: string;
}

interface SupplierSelectProps {
  onSelect: (id: number) => void;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({ onSelect }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(1);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get<Supplier[]>(API_ROUTES.SUPPLIERS);
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedSupplier(id);
    onSelect(id);
  };

  return (
    <div className="mb-4">
      <label htmlFor="supplierSelect" className="block text-lg font-medium mb-2">
        Nhà cung cấp:
      </label>
      <select
        id="supplierSelect"
        value={selectedSupplier ?? ''}
        onChange={handleChange}
        className="border rounded p-2 w-full"
      >
        <option value="">Chọn nhà cung cấp</option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.supplierName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SupplierSelect;
