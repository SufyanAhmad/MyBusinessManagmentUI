export interface flockModel {
  flockId: string;
  ref: string;
  breed: string;
  quantity: number;
  arrivalDate: string;
  isHen: boolean;
  businessUnitId: string;
  businessUnit: string;
  price: number;
  supplierId: string;
  supplier: string;
}
export interface LiveStockModel {
  livestockBatchId: string;
  breed: string;
  quantity: number;
  arrivalDate: string;
  ageInDays: number;
  healthStatus: string;
  businessUnitId?: string;
}
export interface VaccinationModel {
  vaccinationId: string;
  refCount: number;
  ref: string;
  businessUnitName: string;
  flockRef: string;
  createdAt: string;
  createdBy: string;
  vaccineName: string;
  businessUnitId: string;
  flockId: string;
  givenDate: string;
  givenBy: string;
  price: number;
  supplierId: string;
  supplier: string;
}

export interface feedStockModel {
  feedStockId: string;
  feedType: string;
  quantity: number;
  unit: string;
  receivedDate: string;
  archived: boolean;
}
export interface feedRecordModel {
  feedRecordId: string;
  ref: string;
  flockId: string;
  flockRef: string;
  date: string;
  feedTypeId: number;
  feedType: string;
  quantityKg: number;
  businessUnitId: string;
  businessUnit: string;
  price: number;
  supplierId: string;
  supplier: string;
}
export interface eggProductionModel {
  eggProductionId: string;
  refCount: number;
  ref: string;
  businessUnitName: string;
  flockRef: string;
  createdAt: string;
  createdBy: string;
  flockId: string;
  businessUnitId: string;
  totalEggs: number;
  fertileEggs: number;
  brokenEggs: number;
  date: string;
}
export interface eggTransferModel {
  eggTransferId: string;
  ref: string;
  flockId: string;
  flockRef: string;
  dateTransferred: string;
  eggsSent: number;
  hatcheryName: string;
  businessUnitId: string;
  businessUnit: string;
}
