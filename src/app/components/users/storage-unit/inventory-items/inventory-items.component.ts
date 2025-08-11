import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, merge, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
import { inventoryModel } from '../../../../models/storage-unit-model/storage-unit-model';
import { StorageUnitService } from '../../../../services/storage-unit-service/storage-unit.service';
@Component({
  selector: 'app-inventory-items',
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    SelectModule,
    SkeletonModule,
    ToastModule,
    LoadingComponent,
    DataNotFoundComponent,
    RouterLink,
    ConfirmationPopupComponent,
  ],
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
  providers: [MessageService],
})
export class InventoryItemsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  inventoryItemsList: inventoryModel[] = [];
  dataSource!: MatTableDataSource<inventoryModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  types: masterModal[] = [];
  productVarieties: masterModal[] = [];
  partiesTypes: masterModal[] = [];
  addInventoryPopupVisible: boolean = false;
  addLoading: boolean = false;
  itemLoading: boolean = false;
  showConfirmationDialog: boolean = false;
  inVentoryItemId: any = null;
  confirmationMessage: string =
    'Are you sure you want to delete this stock out item.';
  isTableEdit: boolean = false;
  totalQuantity: number = 0;
  businessUnitName: any = '';
  busUnitId: any = null;
  to: any = null;
  from: any = null;
  partyId: any = null;
  inventoryForm!: FormGroup;

  displayedColumns: string[] = [
    'ref',
    'name',
    'type',
    'variety',
    'price',
    'quantity',
    'date',
    'expireDate',
    'tray',
    'crate',
    'note',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private messageService: MessageService,
    private storageUnitService: StorageUnitService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');

    this.inventoryForm = this.formBuilder.group({
      supplierId: [null, [Validators.required]],
      quantity: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      price: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      typeId: [null, [Validators.required]],
      varietyId: [null, [Validators.required]],
      date: [new Date().toISOString().substring(0, 10), [Validators.required]],
      expiryDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      businessUnitId: [this.busUnitId],
      note: [''],
      tray: [0],
      crate: [0],
    });
    this.loadPartiesTypes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getInventoryItemList();
    }, 0);
  }
  getInventoryItemList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.inventoryItemsList = [];
    this.dataSource = new MatTableDataSource(this.inventoryItemsList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.inventoryItemsList = [];
          this.dataSource = new MatTableDataSource(this.inventoryItemsList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          if (this.to == '' || this.from == '') {
            this.to = null;
            this.from = null;
          }
          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            clientId: this.partyId,
            isActive: true,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
            from: this.from,
            to: this.to,
          };

          return this.storageUnitService
            .getInventoryItemsBySearchFilter(data)
            .pipe(
              catchError((resp: any) => {
                if (resp.status == 401) {
                  this.accountService.doLogout();
                  this.router.navigateByUrl('/');
                }
                return resp;
              })
            );
        }),
        map((data) => {
          this.isRateLimitReached = data === null;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.totalCount;
          return data;
        })
      )
      .subscribe(
        (data) => {
          this.inventoryItemsList = [];
          for (let a = 0; a < data.list.length; a++) {
            let inventory: inventoryModel = {
              inventoryItemId: data.list[a].inventoryItemId,
              reference: data.list[a].reference,
              typeId: data.list[a].typeId,
              type: data.list[a].type,
              varietyId: data.list[a].varietyId,
              variety: data.list[a].variety,
              quantity: data.list[a].quantity,
              price: data.list[a].price,
              supplierId: data.list[a].supplierId,
              supplier: data.list[a].supplier,
              date: data.list[a].date,
              expiryDate: data.list[a].expiryDate,
              note: data.list[a].note,
              businessUnitId: data.list[a].businessUnitId,
              businessUnit: data.list[a].businessUnit,
              isActive: data.list[a].isActive,
              tray: data.list[a].tray,
              crate: data.list[a].crate,
            };
            this.inventoryItemsList.push(inventory);
          }
          this.dataSource = new MatTableDataSource(this.inventoryItemsList);
          this.isLoadingResults = false;
        },
        (error) => {
          this.isLoadingResults = false;
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }
  // set by default productId 1 one when stock in popup is open
  resetForm() {
    this.inventoryForm.reset({
      date: new Date().toISOString().substring(0, 10),
      expiryDate: new Date().toISOString().substring(0, 10),
    });
    this.addInventoryPopupVisible = true;
    this.inventoryItemsList = [];
    this.totalQuantity = 0;
  }

  loadPartiesTypes() {
    this.masterService.getPartyTypesByPartyId(1).subscribe(
      (res) => {
        var dt = res;
        this.partiesTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name,
          };
          this.partiesTypes.push(_data);
        }
        this.loadTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadProductVarieties() {
    this.masterService.getVarietiesTypes(1).subscribe(
      (res) => {
        var dt = res;
        this.productVarieties = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].varietyId,
            type: dt[a].value,
          };
          this.productVarieties.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadTypes() {
    this.masterService.getTypes(0).subscribe(
      (res) => {
        var dt = res;
        this.types = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].typeId,
            type: dt[a].value,
          };
          this.types.push(_data);
        }
        this.loadProductVarieties();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }

  onSubmit() {
    this.itemLoading = true;
    this.inventoryForm.value.businessUnitId = this.busUnitId;
    this.storageUnitService
      .addInventoryItem(this.inventoryForm.value)
      .subscribe(
        (dt) => {
          this.itemLoading = false;
          this.getInventoryBySupplierId(dt.supplierId);
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Inventory item added successfully',
            life: 3000,
          });
        },
        (error) => {
          this.itemLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  getInventoryBySupplierId(supplierId: any) {
    this.inventoryItemsList = [];
    this.totalQuantity = 0;
    if (supplierId != null) {
      this.loading = true;
      this.storageUnitService
        .getInventoryItemBySupplierId(supplierId)
        .subscribe(
          (res) => {
            var data = res;
            this.inventoryItemsList = [];
            for (let a = 0; a < data.length; a++) {
              let inventory: inventoryModel = {
                inventoryItemId: data[a].inventoryItemId,
                reference: data[a].reference,
                typeId: data[a].typeId,
                type: data[a].type,
                varietyId: data[a].varietyId,
                variety: data[a].variety,
                quantity: data[a].quantity,
                price: data[a].price,
                supplierId: data[a].supplierId,
                supplier: data[a].supplier,
                date: data[a].date?.split('T')[0],
                expiryDate: data[a].expiryDate?.split('T')[0],
                note: data[a].note,
                businessUnitId: data[a].businessUnitId,
                businessUnit: data[a].businessUnit,
                isActive: data[a].isActive,
                tray: data[a].tray,
                crate: data[a].crate,
                isEdit: true,
                loading: false,
              };
              this.totalQuantity = this.totalQuantity + inventory.quantity;
              this.inventoryItemsList.push(inventory);
            }
            this.loading = false;
          },
          (error) => {
            if (error.status == 401) {
              this.accountService.doLogout();
            }
          }
        );
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
    this.partyId = null;
    this.from = null;
    this.to = null;
  }
  editInventoryItems() {
    this.addLoading = true;
    const updatedInventoryItemsList = this.inventoryItemsList.map((item) => ({
      inventoryItemId: item.inventoryItemId,
      typeId: Number(item.typeId),
      varietyId: Number(item.varietyId),
      quantity: Number(item.quantity),
      price: Number(item.price),
      supplierId: item.supplierId,
      date: new Date(item.date).toISOString(),
      expiryDate: new Date(item.expiryDate).toISOString(),
      tray: item.tray,
      crate: item.crate,
      note: item.note,
      businessUnitId: item.businessUnitId,
    }));

    // console.log(updatedInventoryItemsList);
    this.storageUnitService
      .updateInventoryItems(updatedInventoryItemsList)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.addInventoryPopupVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Inventory items update successfully',
            life: 3000,
          });
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  deleteInventoryItem() {
    this.showConfirmationDialog = false;
    const idx = this.inventoryItemsList.findIndex(
      (item) => item.inventoryItemId === this.inVentoryItemId
    );
    if (idx === -1) return;

    this.inventoryItemsList[idx].loading = true;

    this.storageUnitService.DeleteInventoryItem(this.inVentoryItemId).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Inventory item deleted successfully',
          life: 3000,
        });
        this.totalQuantity -= this.inventoryItemsList[idx].quantity;
        this.inventoryItemsList.splice(idx, 1);
      },
      (error) => {
        this.inventoryItemsList[idx].loading = false;
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 5000,
        });
      }
    );
  }

  //get the sum of total quantity
  getTotalInventoryItemsQuantity() {
    const totalInventoryItemsQuantitySum = this.inventoryItemsList.reduce(
      (sum, item) => {
        return sum + (Number(item.quantity) || 0); // ensure it's a number
      },
      0
    );
    this.totalQuantity = totalInventoryItemsQuantitySum;
  }
  validateLeadingZero(event: any) {
    const input = event.target;

    // If input is empty or less than or equal to 0, replace with 1
    if (!input.value || Number(input.value) <= 0) {
      input.value = '1';
    }

    // Remove leading zeros if input has more than one character
    else if (input.value.length > 1 && input.value.startsWith('0')) {
      input.value = input.value.replace(/^0+/, '');
    }
  }
  showConfirmation() {
    this.confirmationMessage =
      'Are you sure you want to delete this inventory item?';

    this.showConfirmationDialog = true;
  }
  handleCancelled() {
    this.showConfirmationDialog = false;
  }
}
