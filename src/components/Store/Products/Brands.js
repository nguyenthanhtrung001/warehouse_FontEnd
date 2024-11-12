// Brands.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Brands = ({ selectedBrands, setSelectedBrands }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Hãng sản xuất:</h2>
      <div className="flex flex-col">
        {brands.map((brand) => (
          <label key={brand.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.brandName)}
              onChange={() => handleBrandChange(brand.brandName)}
              className="mr-2"
            />
            {brand.brandName}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Brands;
