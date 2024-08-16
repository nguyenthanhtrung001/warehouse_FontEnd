// types/brand.ts
export interface BRAND {
  id: number;
  productName: string;
  weight: number;
  description: string;
  productGroup: {
    id: number;
    groupName: string;
  };
  brand: {
    id: number;
    brandName: string;
  };
  image: string | null;
  price: number | null;
  quantity: number;
}
