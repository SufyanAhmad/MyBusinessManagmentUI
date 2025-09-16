import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  constructor(private repositoryService: RepositoryService) {}
  getUserBySearchFilter(data: any) {
    return this.repositoryService
      .post('User/get-users-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addUser(data: any) {
    return this.repositoryService.post('Account/register', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getUserDetail(id: any) {
    return this.repositoryService.get('User/get-user/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateUserDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('User/update-user/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  changeUserStatus(data: any) {
    return this.repositoryService.post('User/change-status', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteUser(userId: any) {
    return this.repositoryService.delete('User/delete-user/' + userId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBusinessCounts(id: any) {
    return this.repositoryService
      .get(
        'User/get-cold-store-poultry-farm-storage-unit-total-business-unit-count/' +
          id,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getBusinessUnits() {
    return this.repositoryService
      .get('BusinessUnit/get-all-business-unit', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addBusinessUnit(data: any) {
    return this.repositoryService
      .post('BusinessUnit/add-business-unit', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getBusinessUnitDetail(id: any) {
    return this.repositoryService
      .get('BusinessUnit/get-business-unit/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateBusinessDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('BusinessUnit/update-business-unit/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  deleteBusinessUnit(id: any) {
    return this.repositoryService
      .delete('BusinessUnit/delete-business-unit' + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getActivityLogs(data: any) {
    return this.repositoryService
      .post(
        'ActivityLog/get-activity-log-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  clearAllActivity() {
    return this.repositoryService
      .delete('ActivityLog/clear-all-activity-log')
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCustomerSupplierBySearchFilter(data: any) {
    return this.repositoryService
      .post('Party/get-party-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getEmployeeBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'Employee/get-employee-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCustomerPaymentBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'CustomerPayment/get-customer-payment-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addCustomerSupplier(data: any) {
    return this.repositoryService.post('Party/add-party', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  addEmployee(data: any) {
    return this.repositoryService
      .post('Employee/add-employee', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addCustomerPayment(data: any) {
    return this.repositoryService
      .post('CustomerPayment/add-payment', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCustomerSupplierDetail(id: any) {
    return this.repositoryService.get('Party/get-party/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getEmployeeDetail(id: any) {
    return this.repositoryService.get('Employee/get-employee/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateCustomerSupplierDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('Party/update-party/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateEmployee(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('Employee/update-employee-isActive/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateCustomerSupplierStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile('Party/update-party-is-active/' + id + '/' + status, [])
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateEmployeeStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'Employee/update-employee-isActive/' + id + '/' + status,
        []
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getAllBusinessUnitByUserId(id: any) {
    return this.repositoryService
      .get(
        'BusinessUnit/get-all-business-unit-by-user-with-added-flag/' + id,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getAllAddedBusinessUnitByUserId(id: any) {
    return this.repositoryService
      .get('BusinessUnit/get-added-business-unit-by-user/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  assignBusinessUnitToUser(data: any) {
    return this.repositoryService
      .post('UserBusinessUnit/add-user-business-unit', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateBusinessUnitToUser(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('UserBusinessUnit/update-user-business-unit/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getColdStoreShelf(data: any) {
    return this.repositoryService
      .post(
        'ColdStoreShelf/get-cold-store-shelf-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getRooms(data: any) {
    return this.repositoryService
      .post('Room/get-room-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getVoucherTypes(data: any) {
    return this.repositoryService.get('Master/get-voucher-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getLedgerTransactionBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'CustomerPayment/get-customer-payment-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getTotalCounts() {
    return this.repositoryService
      .get('Dashboard/get-total-user-customer-supplier', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStorageUnitBarGraph() {
    return this.repositoryService
      .get('Dashboard/get-storage-unit-bar-graph', true)
      .pipe(
        map((resource: any) => {
          return resource;
        })
      );
  }

  getCustomerDetailById(id: any) {
    return this.repositoryService
      .get('CustomerPayment/get-payment/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getBankLedgerBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'BankLedger/get-bankLedger-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addBankLedger(data: any) {
    return this.repositoryService
      .post('BankLedger/add-bankLedger', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getBankLedgerDetail(id: any) {
    return this.repositoryService
      .get('BankLedger/get-bankLedger/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  // Dairy farm //
  addAnimal(data: any) {
    return this.repositoryService.post('Animal/add-animal', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
