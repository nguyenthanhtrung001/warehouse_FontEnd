// Interface for Location
export interface Location {
    id: number;
    warehouseLocation: string;
    warehouseId: number;
    status: string | null;
    capacity: number | null;
    currentLoad: number | null;
  }
  
  // Interface for Product
  export interface Product {
    id: number;
    productName: string;
    weight: number;
    description: string;
    status: number;
    quantity: number;
  }
  
  // Interface for BatchDetail
  export interface BatchDetail {
    product: Product;
    quantity: number;
  }
  