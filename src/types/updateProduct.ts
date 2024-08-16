// src/types/updateProduct.ts
export interface UpdateProductForm {
    productName?: string;
    category?: string;
    brandName?: string;
    price?: number;
    weight?: number;
    description?: string;
    image?: string;
    sold?: number;
    profit?: number;
    code?: string;
    unit?: string;
    quantity?: number;
    quantityReturn?: number;
    idBath?: number;
    discount?: number;
    note?: string;
    productGroup?: number; // Thêm trường này
    brand?: number;        // Thêm trường này
    images?: string;       // Thêm trường này
    prices?: number;       // Thêm trường này
    employeeId?: number;   // Thêm trường này
  }
  