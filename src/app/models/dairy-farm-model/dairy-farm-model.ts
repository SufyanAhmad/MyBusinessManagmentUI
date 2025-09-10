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
export interface LiveStockModel{
  livestockBatchId:string;
  breed:string;
  quantity: number;
  arrivalDate:string;
  ageInDays: number;
  healthStatus:string;
  businessUnitId:string;
};
