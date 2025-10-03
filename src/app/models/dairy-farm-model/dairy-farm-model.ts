export interface StockOutModel {
  batchReference: string;
  reference: string;
  stockOutId: string;
  stockId: string;
  outQuantity: number;
  stockOutDate: string;
  rentMonths: number;
  totalDays: string;
  clientId: string;
  client: string;
  stockInDate: string;
  rentRate: number;
  note: string;
  remainingStock: number;
  totalRentRate: number;
}
export interface LiveStockModel {
  livestockBatchId: string;
  breed: string;
  quantity: number;
  arrivalDate: string;
  ageInDays: number;
  healthStatus: string;
  businessUnitId: string;
}
// Dairy Farm Models //
export interface BusinessUnitModel {
  totalProfit: number;
  totalSale: number;
  businessUnitId: string;
  name: string;
  location: string;
  businessTypeId: number;
  businessTypeName: string;
  isAdded?: boolean;
  isChecked?: boolean;
  userRoleId?: number;
  totalUser?: number;
  totalEmployee?: number;
  totalStockIn?: number;
  totalStockOut?: number;
  totalPendingItems?: number;
  totalInventoryItems?: number;
  totalSales?: number;
  totalStorageUnitPendingItems?: number;
}
export interface DairyFarmModel {
  businessUnitId: String;
  name: String;
  location: String;
  businessTypeId: number;
  businessType: string;
}
export interface AnimalModel {
  animalId?: String;
  createdBy?: String;
  createdAt?: String;
  animalRef?: String;
  animalType?: String;
  businessUnit?: String;
  breedRef?: String;
  animalTypeId: number;
  breedId: String;
  animalCode: String;
  age: String;
  isFemale: Boolean;
  isActive: Boolean;
  purchaseDate: String;
  price: number;
  note: String;
  businessUnitId: String;
  guardian1: String;
  guardian2: String;
  placeOfBirth: String;
  weight: String;
  animalStatusId: number;
}
export interface BreedModel {
  breedId: String;
  breedRef: String;
  animalType: String;
  businessUnit: String;
  animalTypeId: number;
  name: String;
  origin: String;
  note?: String;
  businessUnitId: String;
}
export interface FeedModel {
  feedId: String;
  feedRef: String;
  animalRef: String;
  supplierName: String;
  businessUnit: String;
  animalId: String;
  supplierId: String;
  name: String;
  quantity: Number;
  feedTime: String;
  note: String;
  businessUnitId: String;
}
export interface MilkProductionModel {
  updatedBy?: String;
  updatedAt?: String;
  milkProductionId?: String;
  milkProductionRef?: String;
  animalRef?: String;
  businessUnit?: String;
  createdBy?: String;
  createdAt?: String;
  animalId: String;
  date: String;
  morning: Number;
  evening: Number;
  total: Number;
  businessUnitId: String;
}
export interface PregnancyRecordModel {
  updatedBy?: String;
  updatedAt?: String;
  pregnancyBirthRecordId?: String;
  recordRef?: String;
  animalRef?: String;
  breedRef?: String;
  businessUnit?: String;
  createdBy?: String;
  createdAt?: String;
  animalId: String;
  breedId: String;
  pregnantDate: String;
  expectedDelivery: String;
  actualDelivery: String;
  delivered: Boolean;
  businessUnitId: String;
}
export interface VaccineRecordModel {
  updatedBy?: String;
  updatedAt?: String;
  healthVaccinationRecordId?: String;
  recordRef?: String;
  supplierName?: String;
  businessUnit?: String;
  createdBy?: String;
  createdAt?: String;
  supplierId: String;
  date: String;
  name: String;
  purpose: String;
  nextDueDate: String;
  businessUnitId: String;
}
export interface HealthRecordModel {
  animalHealthId?: String;
  animalHealthRef?: String;
  createdBy?: String;
  createdAt?: String;
  animalRef?: String;
  businessUnit?: String;
  animalId: String;
  businessUnitId: String;
  weight: Number;
  temperature: Number;
  illnessNotes: String;
  medicineTreatment: String;
  lastCheckupDate: String;
  remarks: String;
}
export interface AnimalHealthVaccination {
  animalHealthVaccinationMappingId?: String;
  animalHealthVaccinationStatusId: Number;
  animalHealthVaccinationStatus?: String;
  animalRef?: String;
  name: String;
  createdAt?: String;
  date: String;
  animalId: String;
  healthVaccinationRecordId?: String;
}
