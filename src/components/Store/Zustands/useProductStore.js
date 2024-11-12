import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  
  // Đặt danh sách sản phẩm
  setProducts: (products) => set({ products }),

  // Đặt sản phẩm được chọn
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));

export default useProductStore;
