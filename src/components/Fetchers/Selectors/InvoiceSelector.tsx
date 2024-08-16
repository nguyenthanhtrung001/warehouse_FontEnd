import React from 'react';
import Select from 'react-select';

interface Props {
  options: { value: any; label: string }[];
  onChange: (selectedOption: any) => void;
}

const InvoiceSelector: React.FC<Props> = ({ options, onChange }) => (
  <Select
    options={options}
    onChange={onChange}
    className="w-80"
    placeholder="Tìm kiếm hóa đơn..."
  />
);

export default InvoiceSelector;
