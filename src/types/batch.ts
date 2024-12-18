// src/types/index.ts

export interface Batch {
    statusColor: string;
    id: number;
    batchName: string;
    expiryDate: string | null;
    note: string;
    status: number;
    warehouseId: number;
  }
  
  export interface Product {
    id: number;
    productName: string;
    weight: number;
    description: string;
    status: number;
    quantity: number;
  }
  
  export interface Location {
    id: number;
    warehouseLocation: string;
    warehouseId: number;
    status: number | null;
    capacity: number | null;
    currentLoad: number | null;
  }
  
  export interface BatchDetail {
    id: number;
    product: Product;
    quantity: number;
    location: Location;
  }
  