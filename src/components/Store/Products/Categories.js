// Categories.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = ({ selectedCategories, setSelectedCategories }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/product-groups");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (groupName) => {
    if (selectedCategories.includes(groupName)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== groupName));
    } else {
      setSelectedCategories([...selectedCategories, groupName]);
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Danh mục:</h2>
      <div className="flex flex-col">
        {categories.map((category) => (
          <label key={category.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.groupName)}
              onChange={() => handleCategoryChange(category.groupName)}
              className="mr-2"
            />
            {category.groupName}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Categories;
