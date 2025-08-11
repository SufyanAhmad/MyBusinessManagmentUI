export interface ClodStoreShelfModel {
  coldStoreShelfId: string;
  businessUnitId: string;
  businessUnit: string;
  shelfName: string;
  coldStoreShelfNo?: number;
  capacityCubicFeet: number;
  isOccupied: boolean;
  archived?: boolean;
}
export interface roomModel {
  roomId: string;
  roomNo: number;
  isArchived: boolean;
  isOccupied: boolean;
  name: string;
  businessUnitId: string;
}

export interface StockInModel {
  stockId: string;
  partyId: string;
  party: string;
  productTypeId: number;
  productType: string;
  farmerName: string;
  quantity: number;
  batchReference: string;
  reference?: string;
  itemName: string;
  coldStoreShelfId: string;
  coldStoreShelf: string;
  coldStoreShelfNo: number;
  unitId: number;
  unit: string;
  varietyId: number;
  variety: string;
  startDate: string;
  note: string;
  voucherId: string;
  voucher: string;
  businessUnitId: string;
  businessUnit: string;
  isActive: false;
  typeId?: string;
  type?: string;
  remainingStock?: number;
  totalRentRate?: number;
  constRemainingStock?: number;
  rentMonths?: number;
  loading?: boolean;
  inActiveStockOutCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  roomId?: string;
  room?: string;
  roomNo?: number;
}
export interface StockOutModel {
  batchReference: string;
  reference?: string;
  stockOutId?: string;
  stockId: string;
  outQuantity: number;
  stockOutDate: string;
  rentRate: number;
  rentMonths: number;
  note: string;
  remainingStock: number;
  totalRentRate: number;
  previousOutQuantity?: number;
  loading?: boolean;
  totalDays?: string;
  clientId?: string;
  client?: string;
  stockInDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}
export interface addTypeVarietyUnitModel {
  id: number;
  value: string;
  productTypeId: number;
}
