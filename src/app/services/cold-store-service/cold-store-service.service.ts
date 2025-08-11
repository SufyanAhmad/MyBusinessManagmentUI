import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColdStoreServiceService {
  constructor(private repositoryService: RepositoryService) {}
  addRoom(data: any) {
    return this.repositoryService.post('Room/add-room', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  addColdStoreShelf(data: any) {
    return this.repositoryService
      .post('ColdStoreShelf/add-cold-store-shelf', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateColdStoreShelfDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('ColdStoreShelf/update-cold-store-shelf/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateArchiveStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'ColdStoreShelf/update-cold-store-shelf-archive/' +
          id +
          '?archive=' +
          status,
        []
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateRoomArchiveStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile('Room/update-room-archive/' + id + '/' + status, [])
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getColdStoreShelfDetail(id: any) {
    return this.repositoryService
      .get('ColdStoreShelf/get-cold-store-shelf/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  deleteColdStoreShelf(id: any) {
    return this.repositoryService
      .delete('ColdStoreShelf/delete-cold-store-shelf/' + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addStockInItem(data: any) {
    return this.repositoryService.post('Stock/stock-in', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getStocksBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'Stock/get-stock-in-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStockInBySearchFilter(data: any) {
    debugger;
    return this.repositoryService
      .post(
        'Stock/get-stock-in-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStockOutBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'Stock/get-stock-out-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateStockOutItems(data: any) {
    return this.repositoryService
      .putWithOutFile('Stock/update-stock-out', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateStockInItems(data: any) {
    return this.repositoryService
      .putWithOutFile('Stock/update-stock-in', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  saveAllStockInItems(partyId: any, productTypeId: any) {
    return this.repositoryService
      .post(
        'Stock/save-stocks/' + partyId + '?productTypeId=' + productTypeId,
        {},
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStocksByPartyId(partyId: any, productTypeId: any) {
    return this.repositoryService
      .post(
        'Stock/get-stocks-by-party/' +
          partyId +
          '?productTypeId=' +
          productTypeId +
          '&isActive=' +
          false,
        {},
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStockInDetailById(id: any) {
    return this.repositoryService
      .post('Stock/get-stock-detail/' + id, {}, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStockOutDetailById(id: any) {
    return this.repositoryService
      .post('Stock/get-stock-out-detail/' + id, {}, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  stockOut(data: any) {
    return this.repositoryService.post('Stock/stock-out', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getStockOutById(stockId: any) {
    return this.repositoryService
      .get('Stock/get-stock-outs/' + stockId + '?isActive=' + false, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteStockOutItem(stockOutId: any) {
    return this.repositoryService
      .delete('Stock/delete-stock-out/' + stockOutId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteStockInItem(stockInId: any) {
    return this.repositoryService
      .delete('Stock/delete-stock-in/' + stockInId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddCategory(data: any) {
    return this.repositoryService.post('Master/add-category', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  AddType(data: any) {
    return this.repositoryService.post('Master/add-type', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  AddUnit(data: any) {
    return this.repositoryService.post('Master/add-unit', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  AddVariety(data: any) {
    return this.repositoryService.post('Master/add-variety', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getTypesWithFlag(id: any) {
    return this.repositoryService
      .get('Master/get-types-with-flag?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateTypesStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'Master/update-type-isActive/' + id + '?isActive=' + status,
        []
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getUnitsWithFlag(id: any) {
    return this.repositoryService
      .get('Master/get-units-with-flag?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateUnitsStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'Master/update-unit-isActive/' + id + '?isActive=' + status,
        []
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getVarietiesWithFlag(id: any) {
    return this.repositoryService
      .get('Master/get-varieties-with-flag?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateVarietiesStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'Master/update-variety-isActive/' + id + '?isActive=' + status,
        []
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddEmployeeType(data: any) {
    return this.repositoryService
      .post('Master/add-employee-type', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getEmployeeTypesWithFlag() {
    return this.repositoryService
      .get('Master/get-employee-types-with-flag', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateEmployeeStatus(id: any, status: any) {
    return this.repositoryService
      .putWithOutFile(
        'Master/update-employee-type-isActive/' + id + '?isActive=' + status,
        []
      )
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
  getTypeDetail(id: any) {
    return this.repositoryService.get('Master/get-type/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateTypeDetail(data: any) {
    return this.repositoryService.putWithOutFile('Master/edit-type', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getUnitDetail(id: any) {
    return this.repositoryService.get('Master/get-unit/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateUnitDetail(data: any) {
    return this.repositoryService.putWithOutFile('Master/edit-unit', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getVarietyDetail(id: any) {
    return this.repositoryService.get('Master/get-variety/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateVarietyDetail(data: any) {
    return this.repositoryService
      .putWithOutFile('Master/edit-variety', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getEmployeeDetail(id: any) {
    return this.repositoryService
      .get('Master/get-employee-type/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateEmployeeDetail(data: any) {
    return this.repositoryService
      .putWithOutFile('Master/edit-employee-type', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCategoryWithFlag() {
    return this.repositoryService
      .get('Master/get-categories-with-flag', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteColdStoreShelf(coldStoreShelfId: any) {
    return this.repositoryService
      .delete('Master/delete-cold-store-shelf/' + coldStoreShelfId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteRoom(id: any) {
    return this.repositoryService.delete('Master/delete-room/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  DeleteType(id: any) {
    return this.repositoryService.delete('Master/delete-type/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  DeleteUnit(id: any) {
    return this.repositoryService.delete('Master/delete-unit/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  DeleteVariety(id: any) {
    return this.repositoryService.delete('Master/delete-variety/' + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  DeleteEmployee(id: any) {
    return this.repositoryService
      .delete('Master/delete-employee-type/' + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateStockInDetail(data: any) {
    return this.repositoryService
      .putWithOutFile('Stock/update-stock-in-detail', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteStockInDetail(id: any) {
    return this.repositoryService
      .delete('Stock/delete-stock-in-detail/' + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteStockOutDetail(id: any) {
    return this.repositoryService
      .delete('Stock/delete-stock-out-detail/' + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateStockOutDetail(data: any) {
    return this.repositoryService
      .putWithOutFile('Stock/update-stock-out-detail', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddProduct(data: any) {
    return this.repositoryService.post('Master/add-product', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
