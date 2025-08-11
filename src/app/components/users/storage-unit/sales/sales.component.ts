import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../../loading/loading.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { CheckboxModule } from 'primeng/checkbox';
import { salesModel } from '../../../../models/storage-unit-model/storage-unit-model';
import { AccountService } from '../../../../services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { catchError, map, merge, startWith, switchMap, tap } from 'rxjs';
import { StorageUnitService } from '../../../../services/storage-unit-service/storage-unit.service';
import { StockInModel } from '../../../../models/cold-store-model/cold-store-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { masterModal } from '../../../../models/master-model/master-model';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-sales',
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SelectModule,
    SkeletonModule,
    ToastModule,
    LoadingComponent,
    DataNotFoundComponent,
    RouterLink,
    ConfirmationPopupComponent,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  providers: [MessageService],
})
export class SalesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() editRouteBase: string = '/storageUnit/sales';
  salesList: salesModel[] = [];
  dataSource!: MatTableDataSource<salesModel>;
  isLoadingResults: any = false;
  isRateLimitReached = false;
  resultsLength: any = 0;
  searchKey: any = null;
  clientId: any = null;
  busUnitId: any = null;
  businessUnitName: any = '';
  inStockPopupVisible: boolean = false;
  totalQuantity: number = 0;
  types: masterModal[] = [];
  productVarieties: masterModal[] = [];
  products: masterModal[] = [];
  partiesTypes: masterModal[] = [];
  businessUnit: masterModal[] = [];
  businessUnitId: number | null = null;
  loading: boolean = false;
  showConfirmationDialog: boolean = false;
  confirmationMessage: string = 'Are you sure you want to delete this sale.';
  addSalePopupVisible: boolean = false;
  itemLoading: boolean = false;
  addLoading: boolean = false;
  saleId: any = null;
  to: any = null;
  from: any = null;
  partyId: any = null;
  selectedType = 'Egg Sale';

  salesForm!: FormGroup;
  displayedColumns: string[] = [
    'ref',
    'name',
    'type',
    'variety',
    'price',
    'quantity',
    'date',
    'tray',
    'crate',
    'note',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private messageService: MessageService,
    private storageUnitService: StorageUnitService,
    // private coldStoreService: ColdStoreServiceService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.salesForm = this.formBuilder.group({
      customerId: [null, [Validators.required]],
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
      businessUnitId: [this.busUnitId],
      tray: [0],
      crate: [0],
      eggs: [0],
      note: [''],
      productId: [null, [Validators.required]],
    });
    this.loadPartiesTypes();
    this.loadProducts();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getSales();
    }, 0);
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getSales();
      }
    }
  }
  getSales() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.salesList = [];
    this.dataSource = new MatTableDataSource(this.salesList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.salesList = [];
          this.dataSource = new MatTableDataSource(this.salesList);

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

          return this.storageUnitService.getSalesBySearchFilter(data).pipe(
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
          this.salesList = [];
          for (let a = 0; a < data.list.length; a++) {
            let sale: salesModel = {
              saleId: data.list[a].saleId,
              reference: data.list[a].reference,
              typeId: data.list[a].typeId,
              type: data.list[a].type,
              varietyId: data.list[a].varietyId,
              variety: data.list[a].variety,
              quantity: data.list[a].quantity,
              price: data.list[a].price,
              customerId: data.list[a].customerId,
              customer: data.list[a].customer,
              date: data.list[a].date,
              note: data.list[a].note,
              businessUnitId: data.list[a].businessUnitId,
              businessUnit: data.list[a].businessUnit,
              isActive: data.list[a].isActive,
              tray: data.list[a].tray,
              crate: data.list[a].crate,
            };
            this.salesList.push(sale);
          }
          this.dataSource = new MatTableDataSource(this.salesList);
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
  loadPartiesTypes() {
    this.masterService.getPartyTypesByPartyId(0).subscribe(
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
  loadTypes() {
    this.masterService.getTypes(1).subscribe(
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
  loadProducts() {
    this.masterService.getProducts().subscribe(
      (res) => {
        var dt = res.data;
        this.products = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].productId,
            type: dt[a].name,
          };
          this.products.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  resetForm() {
    this.salesForm.reset({
      date: new Date().toISOString().substring(0, 10),
    });
    this.addSalePopupVisible = true;
    this.salesList = [];
    this.totalQuantity = 0;
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
    this.partyId = null;
    this.from = null;
    this.to = null;
  }
  showConfirmation() {
    this.confirmationMessage =
      'Are you sure you want to delete this sale item?';

    this.showConfirmationDialog = true;
  }
  handleCancelled() {
    this.showConfirmationDialog = false;
  }
  getSaleByCustomerId(customerId: any) {
    this.salesList = [];
    this.totalQuantity = 0;
    if (customerId != null) {
      this.loading = true;
      this.storageUnitService.getSaleByCustomerId(customerId).subscribe(
        (res) => {
          var data = res;
          this.salesList = [];
          for (let a = 0; a < data.length; a++) {
            let sale: salesModel = {
              saleId: data[a].saleId,
              reference: data[a].reference,
              typeId: data[a].typeId,
              type: data[a].type,
              varietyId: data[a].varietyId,
              variety: data[a].variety,
              quantity: data[a].quantity,
              price: data[a].price,
              customerId: data[a].customerId,
              customer: data[a].customer,
              date: data[a].date?.split('T')[0],
              note: data[a].note,
              businessUnitId: data[a].businessUnitId,
              businessUnit: data[a].businessUnit,
              isActive: data[a].isActive,
              isEdit: true,
              loading: false,
              tray: data[a].tray,
              crate: data[a].crate,
            };
            this.totalQuantity = this.totalQuantity + sale.quantity;
            this.salesList.push(sale);
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
  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }
  onSubmit() {
    this.itemLoading = true;
    this.salesForm.value.businessUnitId = this.busUnitId;
    this.storageUnitService.addSale(this.salesForm.value).subscribe(
      (dt) => {
        this.itemLoading = false;
        this.getSaleByCustomerId(dt.customerId);
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Sale added successfully',
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
  editSale() {
    this.addLoading = true;
    const updatedSalesList = this.salesList.map((item) => ({
      saleId: item.saleId,
      typeId: Number(item.typeId),
      varietyId: Number(item.varietyId),
      quantity: Number(item.quantity),
      price: Number(item.price),
      customerId: item.customerId,
      date: new Date(item.date as string).toISOString(),
      tray: item.tray,
      crate: item.crate,
      note: item.note,
      businessUnitId: item.businessUnitId,
    }));
    console.log(updatedSalesList);
    this.storageUnitService.updateSale(updatedSalesList).subscribe(
      (dt) => {
        this.addLoading = false;
        this.addSalePopupVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Sales update successfully',
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

  getTotalSalesQuantity() {
    const totalInventoryItemsQuantitySum = this.salesList.reduce(
      (sum, item) => {
        return sum + (Number(item.quantity) || 0); // ensure it's a number
      },
      0
    );
    this.totalQuantity = totalInventoryItemsQuantitySum;
  }
  deleteSale() {
    this.showConfirmationDialog = false;
    const idx = this.salesList.findIndex((item) => item.saleId === this.saleId);
    if (idx === -1) return;

    this.salesList[idx].loading = true;

    this.storageUnitService.DeleteSale(this.saleId).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Sale deleted successfully',
          life: 3000,
        });
        this.totalQuantity -= this.salesList[idx].quantity;
        this.salesList.splice(idx, 1);
      },
      (error) => {
        this.salesList[idx].loading = false;
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
  getTotalSaleQuantity() {
    const totalInventoryItemsQuantitySum = this.salesList.reduce(
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
  onEditSales(saleId: number) {
    this.router.navigate([this.editRouteBase, saleId]);
  }
}
