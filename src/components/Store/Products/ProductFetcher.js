// ProductFetcher.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductFetcher = ({ onProductsFetched }) => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/products");
        const products = response.data.map((product) => ({
          id: product.id,
          name: product.productName,
          brand: product.brand.brandName,
          category: product.productGroup.groupName,
          price: product.price,
          image: product.image,
        }));
        onProductsFetched(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [onProductsFetched]);

  return null; // Không cần render gì
};

export default ProductFetcher;
