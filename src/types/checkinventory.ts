export type InventoryCheckDetail = {
  batchDetail: number;
  inventory: number;
  actualQuantity: number;
  quantityDiscrepancy: number;
};

export type InventoryCheck = {
  status: number;
  totalDiscrepancy: number;
  quantityDiscrepancyIncrease: number;
  quantityDiscrepancyDecrease: number;
  notes: string;
  employeeId: number;
  inventoryCheckDetails: InventoryCheckDetail[];
};
