export interface inventoryModel {
  inventoryItemId: string;
  reference: string;
  typeId: number;
  type: string;
  varietyId: number;
  variety: string;
  quantity: number;
  price: number;
  supplierId: string;
  supplier: string;
  date: string;
  expiryDate: string;
  note: string;
  businessUnitId: string;
  businessUnit: string;
  isActive: boolean;
  loading?: boolean;
  isEdit?: boolean;
  tray: number;
  crate: number;
}
export interface salesModel {
  saleId: String;
  reference: String;
  typeId: number;
  type: String;
  varietyId: number;
  variety: String;
  quantity: number;
  price: number;
  customerId: String;
  customer: String;
  date: String;
  note: String;
  businessUnitId: String;
  businessUnit: String;
  isActive: boolean;
  loading?: boolean;
  isEdit?: boolean;
  tray: number;
  crate: number;
}
