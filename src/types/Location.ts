// types/Location.ts
export interface Location {
  id: number;
  warehouseLocation: string;
  warehouseId: number;
  status: string | undefined;
  capacity: number | null;
  currentLoad: number | null;
}
