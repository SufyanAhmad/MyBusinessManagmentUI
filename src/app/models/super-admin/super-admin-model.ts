export interface UserModel {
  userId: string;
  userNo: string;
  fullName: string;
  email: string;
  imageLink: string;
  isActive?: boolean;
}
export interface BusinessCountModel {
  coldStoreCoun: number;
  poultryFarmCoun: number;
  storageUnitCoun: number;
}
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
  totalStorageUnitPendingItems?: number
}
export interface AddedBusinessUnitModel {
  businessUnitId: string;
  name: string;
  businessTypeId: number;
  businessType: string;
  isChecked: boolean;
  userRoleId: number;
  userRole: string;
}
export interface ActivityLogModel {
  id: string;
  userId: string;
  user: string;
  action: string;
  description: string;
  actionDate: Date;
}
export interface CustomerModel {
  partyId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  partyTypeId: number;
  partyType: string;
}
export interface CustomerPaymentModel {
  paymentId: string;
  clientId: string;
  client: string;
  productTypeId: number;
  productType: string;
  date: string;
  isCredit: boolean;
  totalPayment: string;
  paidAmount: number;
  remainingBalance: number;
  reference: string;
}
export interface LedgerTransactionModel {
  paymentId: string;
  clientId: string;
  client: string;
  account?:string;
  productTypeId: number;
  productType: string;
  date: string;
  totalPayment: number;
  paidAmount: number;
  remainingBalance: number;
  isCredit: boolean;
  reference: string;
  isReturned?:boolean;
  businessUnitId?:string;
  businessUnit?:string;
}
export interface EmployeeModel {
  employeeId: string;
  employeeType: string;
  businessUnit: string;
  name: string;
  employeeTypeId: number;
  joiningDate: string;
  salary: number;
  endDate: string;
  businessUnitId: string;
  isActive?: boolean;
}
export interface TotalCountsModel {
  users: number;
  customers: number;
  suppliers: number;
}
export interface BarGraphModel {
  monthName: any;
  percentage: any;
}
export interface CustomerPaymentDetailModel {
  paymentId: string;
  reference: string;
  client: string;
  businessUnit: string;
  createdBy: string;
  createdAt: string;
  voucherTypeId: string;
  voucherType: string;
  productTypeId: string;
  productType: string;
  billNo: number;
  clientId: string;
  paymentDate: string;
  amount: number;
  note: string;
  isCredit: boolean;
  businessUnitId: string;
}
export interface bankLedgerModel
{
    bankLedgerId: string,
    createdBy: string,
    createdAt: string,
    accountTitle: string,
    accountNumber: number,
    bankName: string,
    branchCode: string,
    city: string
}
export interface expenseModel 
{
updatedBy: string,
updatedAt: string,
expenseId: string,
party: string,
expenseStatus: string,
createdBy: string,
createdAt: string,
date: string,
name: string,
amount: number,
paymentMethod: string,
description: string,
partyId: string,
attachment: string,
expenseStatusId: number
}