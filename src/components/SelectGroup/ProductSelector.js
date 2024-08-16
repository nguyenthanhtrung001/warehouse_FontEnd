import { useState } from "react";

const ProductSelector = ({ onSelect }) => {
  const [selectedTop, setSelectedTop] = useState(1);

  const handleChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedTop(value);
    onSelect(value);
  };

  return (
    <select value={selectedTop} onChange={handleChange} className="p-2 border rounded">
      {[...Array(10).keys()].map((i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  );
};

export default ProductSelector;
