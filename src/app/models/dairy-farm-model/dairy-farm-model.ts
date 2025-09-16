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
  businessUnitId: string;
}
