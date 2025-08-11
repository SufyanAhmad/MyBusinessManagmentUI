import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageUnitService {
  constructor(private repositoryService: RepositoryService) {}
  getInventoryItemsBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'InventoryItem/get-inventory-item-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addInventoryItem(data: any) {
    return this.repositoryService
      .post('InventoryItem/add-inventory-item', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getInventoryItemBySupplierId(supplierId: any) {
    return this.repositoryService
      .get(
        'InventoryItem/get-inventory-items-by-supplier/' +
          supplierId +
          '?isActive=' +
          false,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateInventoryItems(data: any) {
    return this.repositoryService
      .putWithOutFile('InventoryItem/update-inventory-item', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  geInventoryItemById(id: any) {
    return this.repositoryService
      .get('InventoryItem/get-inventory-item-detail/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteInventoryItem(inventoryItemId: any) {
    return this.repositoryService
      .delete('InventoryItem/delete-inventory-item/' + inventoryItemId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getSalesBySearchFilter(data: any) {
    return this.repositoryService
      .post('Sale/get-sale-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addSale(data: any) {
    return this.repositoryService.post('Sale/add-sale', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getSaleByCustomerId(customerId: any) {
    return this.repositoryService
      .get(
        'Sale/get-sales-by-customer/' + customerId + '?isActive=' + false,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  DeleteSale(saleId: any) {
    return this.repositoryService.delete('Sale/delete-sale/' + saleId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateSale(data: any) {
    return this.repositoryService.putWithOutFile('Sale/update-sale', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getSalesById(id: any) {
    return this.repositoryService.get('Sale/get-sale-detail/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
