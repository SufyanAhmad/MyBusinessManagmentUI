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
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, merge, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import {
  StockInModel,
  StockOutModel,
} from '../../../../models/cold-store-model/cold-store-model';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
@Component({
  selector: 'app-stocks',
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
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
  providers: [MessageService],
})
export class StocksComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  stocksList: StockInModel[] = [];
  dataSource!: MatTableDataSource<StockInModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  assignLoading: boolean = false;
  loading: boolean = false;
  resultsLength: any = 0;
  type: string = '';
  deletedItemType: string = '';
  searchKey: any = null;
  businessTypes: masterModal[] = [];
  businessUnitTypes: masterModal[] = [];
  userRoles: masterModal[] = [];
  productTypes: masterModal[] = [];
  productUnits: masterModal[] = [];
  types: masterModal[] = [];
  productVarieties: masterModal[] = [];
  partiesTypes: masterModal[] = [];
  racksTypes: masterModal[] = [];
  roomsTypes: masterModal[] = [];
  stockInList: StockInModel[] = [];
  remainingStock: any = 0;
  totalDays: any = 0;
  constRemainingStock: number = 0;
  businessTypeId: any = null;
  stockOutItemId: any = null;
  stockInItemId: any = null;
  clientId: any = null;
  productTypeId: any = 1;
  busUnitId: any = null;
  isActive: boolean = false;
  isReadonly: boolean = true;
  isStockInEdit: boolean = true;
  userId: any = null;
  applicationUserId: any = null;
  stockId: any = null;
  stockOutList: StockOutModel[] = [];
  inStockPopupVisible: boolean = false;
  outStockPopupVisible: boolean = false;
  addLoading: boolean = false;
  itemLoading: boolean = false;
  detailLoading: boolean = false;
  stockOutLoading: boolean = false;
  showConfirmationDialog: boolean = false;
  confirmationMessage: string =
    'Are you sure you want to delete this stock out item.';
  isTableEdit: boolean = false;
  totalQuantity: number = 0;
  maxOutQuantity: number = 0;
  totalStockOutQuantity: number = 0;
  validationQuantity: any = 0;
  toDate: any = null;
  fromDate: any = null;

  addUserModel!: FormGroup;
  businessUnitName: any = '';
  entries: any[] = [];
  entryForm!: FormGroup;
  stockOutModel!: FormGroup;
  updateStockOutLoading: boolean = false;
  stockOutDetail: StockInModel = {
    stockId: '',
    partyId: '',
    party: '',
    productTypeId: 0,
    productType: '',
    farmerName: '',
    quantity: 0,
    batchReference: '',
    itemName: '',
    coldStoreShelfId: '',
    coldStoreShelf: '',
    coldStoreShelfNo: 0,
    unitId: 0,
    unit: '',
    varietyId: 0,
    variety: '',
    startDate: '',
    note: '',
    voucherId: '',
    voucher: '',
    businessUnitId: '',
    businessUnit: '',
    typeId: '',
    type: '',
    isActive: false,
    constRemainingStock: 0,
    rentMonths: 0.0,
  };

  displayedColumns: string[] = [
    'ref',
    'batch',
    'name',
    'prodType',
    'farName',
    'stoInDate',
    'quantity',
    'remStock',
    'rackNo',
    'unitType',
    'productType',
    'type',
    'room',
    'note',
    'btn',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private messageService: MessageService,
    private coldStoreService: ColdStoreServiceService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.entryForm = this.formBuilder.group({
      partyId: ['', [Validators.required]],
      productTypeId: [1, [Validators.required]],
      farmerName: [''],
      quantity: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      batchReference: [''],
      typeId: [null, [Validators.required]],
      coldStoreShelfId: [null, [Validators.required]],
      roomId: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      varietyId: [null, [Validators.required]],
      startDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      voucherId: [null],
      businessUnitId: [this.busUnitId],
      note: [''],
      rentMonths: [null],
    });
    this._initForm();
    this.loadPartiesTypes();
    this.loadBusinessTypes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getStocksList();
    }, 0);
  }

  calculateDays() {
    const start = this.stockOutDetail.startDate;
    const end = this.stockOutModel.get('stockOutDate')?.value;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalDays = diffDays;
    } else {
      this.totalDays = null;
    }
  }
  getStocksList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.stocksList = [];
    this.dataSource = new MatTableDataSource(this.stocksList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.stocksList = [];
          this.dataSource = new MatTableDataSource(this.stocksList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          if (this.toDate == '' || this.fromDate == '') {
            this.toDate = null;
            this.fromDate = null;
          }

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            isActive: true,
            from: this.fromDate,
            to: this.toDate,
            clientId: this.clientId,
            productTypeId: this.productTypeId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.coldStoreService.getStocksBySearchFilter(data).pipe(
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
          this.stocksList = [];
          for (let a = 0; a < data.list.length; a++) {
            let stockIn: StockInModel = {
              stockId: data.list[a].stockId,
              partyId: data.list[a].partyId,
              party: data.list[a].party,
              productTypeId: data.list[a].productTypeId,
              productType: data.list[a].productType,
              farmerName: data.list[a].farmerName,
              quantity: data.list[a].quantity,
              remainingStock: data.list[a].remainingStock,
              batchReference: data.list[a].batchReference,
              reference: data.list[a].reference,
              itemName: data.list[a].itemName,
              coldStoreShelfId: data.list[a].coldStoreShelfId,
              coldStoreShelf: data.list[a].coldStoreShelf,
              coldStoreShelfNo: data.list[a].coldStoreShelfNo,
              unitId: data.list[a].unitId,
              unit: data.list[a].unit,
              varietyId: data.list[a].varietyId,
              variety: data.list[a].variety,
              startDate: data.list[a].startDate,
              note: data.list[a].note,
              voucherId: data.list[a].voucherId,
              voucher: data.list[a].voucher,
              businessUnitId: data.list[a].businessUnitId,
              businessUnit: data.list[a].businessUnit,
              isActive: data.list[a].isActive,
              inActiveStockOutCount: data.list[a].inActiveStockOutCount,
              roomId: data.list[a].roomId,
              room: data.list[a].room,
              roomNo: data.list[a].roomNo,
              type: data.list[a].type,
            };
            if (stockIn.isActive)
              //  this.totalStockOutQuantity=(this.totalStockOutQuantity+stockIn.quantity);
              this.stocksList.push(stockIn);
          }
          this.dataSource = new MatTableDataSource(this.stocksList);
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
  resetFormKeepProductId() {
    this.entryForm.reset({
      productTypeId: 1, // Keep current or default to 1
      startDate: new Date().toISOString().substring(0, 10),
    });
    this.loadData(1);
    this.inStockPopupVisible = true;
    this.stockInList = [];
    this.totalQuantity = 0;
  }

  loadPartiesTypes() {
    this.masterService.getPartyTypesById(this.busUnitId).subscribe(
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
        this.loadRacksTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadRacksTypes() {
    this.masterService.getRackTypesById(this.busUnitId).subscribe(
      (res) => {
        var dt = res;
        this.racksTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].coldStoreShelfId,
            type: dt[a].shelfName,
          };
          this.racksTypes.push(_data);
        }
        this.loadRoomsTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadRoomsTypes() {
    this.masterService.getRoomTypesById(this.busUnitId).subscribe(
      (res) => {
        var dt = res;
        this.roomsTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].roomId,
            type: dt[a].name,
          };
          this.roomsTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBusinessTypes() {
    this.masterService.getBusinessTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.businessTypes.push(_data);
        }
        this.loadBusinessUnitTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBusinessUnitTypes() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessUnitTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.businessUnitTypes.push(_data);
        }
        this.loadProductTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadProductTypes() {
    this.masterService.getProductTypes().subscribe(
      (res) => {
        var dt = res;
        this.productTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.productTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadProductUnits(id: any) {
    this.masterService.getProductUnits(id).subscribe(
      (res) => {
        var dt = res;
        this.productUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].unitId,
            type: dt[a].value,
          };
          this.productUnits.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }

  loadProductVarieties(id: any) {
    this.masterService.getVarietiesTypes(id).subscribe(
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
  loadTypes(id: any) {
    this.masterService.getTypes(id).subscribe(
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
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadData(productTypeId: any) {
    // let productTypeId=this.entryForm.value.productTypeId;
    this.loadTypes(productTypeId);
    this.loadProductVarieties(productTypeId);
    this.loadProductUnits(productTypeId);
  }
  _initForm() {
    this.stockOutModel = this.formBuilder.group({
      stockId: [this.stockOutDetail.stockId],
      outQuantity: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
          Validators.max(this.maxOutQuantity),
        ],
      ],
      stockOutDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      rentMonths: [1, [Validators.required, Validators.min(0)]],
      rentRate: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(0),
        ],
      ],
      note: [null],
    });
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
    this.entryForm.value.businessUnitId = this.busUnitId;
    this.entryForm.value.voucherId = null;
    // console.log(this.entryForm.value);
    this.coldStoreService.addStockInItem(this.entryForm.value).subscribe(
      (dt) => {
        this.itemLoading = false;
        this.getStockListByPartyId(dt.partyId, dt.productTypeId);
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Stock in item added successfully',
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
  getStockListByPartyId(partyId: any, productTypeId: any) {
    this.totalQuantity = 0;
    if (partyId != null && productTypeId != null) {
      this.loading = true;
      this.coldStoreService
        .getStocksByPartyId(partyId, productTypeId)
        .subscribe(
          (res) => {
            var dt = res;
            this.stockInList = [];
            for (let a = 0; a < dt.length; a++) {
              let stockIn: StockInModel = {
                stockId: dt[a].stockId,
                partyId: dt[a].partyId,
                party: dt[a].party,
                productTypeId: dt[a].productTypeId,
                productType: dt[a].productType,
                farmerName: dt[a].farmerName,
                quantity: dt[a].quantity,
                batchReference: dt[a].batchReference,
                itemName: dt[a].itemName,
                coldStoreShelfId: dt[a].coldStoreShelfId,
                coldStoreShelf: dt[a].coldStoreShelf,
                coldStoreShelfNo: dt[a].coldStoreShelfNo,
                unitId: dt[a].unitId,
                unit: dt[a].unit,
                varietyId: dt[a].varietyId,
                variety: dt[a].variety,
                startDate: dt[a].startDate?.split('T')[0],
                note: dt[a].note,
                voucherId: dt[a].voucherId,
                voucher: dt[a].voucher,
                businessUnitId: dt[a].businessUnitId,
                businessUnit: dt[a].businessUnit,
                isActive: dt[a].isActive,
                typeId: dt[a].typeId,
                loading: false,
                roomId: dt[a].roomId,
                room: dt[a].room,
              };
              this.totalQuantity = this.totalQuantity + stockIn.quantity;
              this.stockInList.push(stockIn);
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
  saveAllStockInItem() {
    this.addLoading = true;
    let partyId = this.entryForm.value.partyId;
    let productTypeId = this.entryForm.value.productTypeId;
    this.coldStoreService.saveAllStockInItems(partyId, productTypeId).subscribe(
      (dt) => {
        this.editStockInItems();
        this.addLoading = false;
        this.inStockPopupVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Stock in items saves successfully',
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
  getStockOutDetail(stockId: any) {
    this.detailLoading = true;
    this.stockId = stockId;
    this.coldStoreService.getStockInDetailById(stockId).subscribe(
      (dt) => {
        let data = dt;
        this.maxOutQuantity = data.allRemainingStock;
        this.remainingStock = data.allRemainingStock;
        this.constRemainingStock = data.allRemainingStock;
        this.loadData(data.productTypeId);

        this.stockOutDetail = {
          stockId: data.stockId,
          partyId: data.partyId,
          party: data.party,
          productTypeId: data.productTypeId,
          productType: data.productType,
          farmerName: data.farmerName,
          quantity: data.quantity,
          batchReference: data.batchReference,
          itemName: data.itemName,
          coldStoreShelfId: data.coldStoreShelfId,
          coldStoreShelf: data.coldStoreShelf,
          coldStoreShelfNo: data.coldStoreShelfNo,
          unitId: data.unitId,
          unit: data.unit,
          varietyId: data.varietyId,
          variety: data.variety,
          startDate: data.startDate,
          note: data.note,
          voucherId: data.voucherId,
          voucher: data.voucher,
          businessUnitId: data.businessUnitId,
          businessUnit: data.businessUnit,
          isActive: data.isActive,
          typeId: data.typeId,
          type: data.type,
          remainingStock: data.allRemainingStock,
          constRemainingStock: data.allRemainingStock,
          totalRentRate: data.totalRentRate,
        };
        this._initForm();

        this.detailLoading = false;
      },
      (error) => {
        this.detailLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 4000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  stockOutProduct() {
    this.stockOutLoading = true;
    this.stockOutModel.value.stockId = this.stockOutDetail.stockId;
    this.coldStoreService.stockOut(this.stockOutModel.value).subscribe(
      (dt) => {
        this.stockOutLoading = false;
        this.stockOutModel.reset();
        this._initForm();
        this.stockOutDetail.remainingStock = dt.allRemainingStock;
        this.getRemainingStock();
        this.getStockOut(this.stockId);
        // this.getStocksList();
        this.messageService.add({
          severity: 'success',
          summary: 'Stock Out',
          detail: 'Stock out completed successfully',
          life: 3000,
        });
      },
      (error) => {
        this.stockOutLoading = false;
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
  getRemainingStock(): any {
    this.isTableEdit = false;
    let outQuantityValue = this.stockOutModel.value.outQuantity;
    this.remainingStock = this.stockOutDetail?.remainingStock;
    if (outQuantityValue > 0 && outQuantityValue <= this.remainingStock) {
      return this.remainingStock - outQuantityValue;
    } else if (
      outQuantityValue == null ||
      outQuantityValue <= 0 ||
      outQuantityValue > this.remainingStock
    ) {
      return this.remainingStock;
    }
  }
  ResetFilter() {
    this.businessTypeId = null;
    this.clientId = null;
    this.searchKey = null;
    this.toDate = null;
    this.fromDate = false;
    this.ngAfterViewInit();
  }
  //stock out
  getStockOut(stockId: any) {
    this.stockOutList = [];
    this.totalStockOutQuantity = 0;
    this.isReadonly = true;
    this.coldStoreService.getStockOutById(stockId).subscribe(
      (dt) => {
        let data = dt;
        for (let a = 0; a < data.length; a++) {
          let stockOut: StockOutModel = {
            stockId: data[a].stockOutId,
            batchReference: '',
            outQuantity: data[a].outQuantity,
            previousOutQuantity: data[a].outQuantity,
            stockOutDate: data[a].stockOutDate?.split('T')[0],
            rentMonths: data[a].rentMonths ? data[a].rentMonths : 1,
            rentRate: data[a].rentRate,
            note: data[a].note,
            remainingStock: 0,
            totalRentRate: data[a].totalRentRate,
            loading: false,
          };
          this.totalStockOutQuantity =
            this.totalStockOutQuantity + stockOut.outQuantity;
          this.stockOutList.push(stockOut);
        }
      },
      (error) => {
        this.stockOutLoading = false;
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
  editStockOutItems() {
    this.updateStockOutLoading = true;
    const updatedList = this.stockOutList.map((item) => ({
      stockOutId: item.stockId,
      outQuantity: item.outQuantity,
      stockOutDate: new Date(item.stockOutDate).toISOString(),
      rentMonths: item.rentMonths,
      rentRate: item.rentRate,
      note: item.note,
    }));

    // console.log(updatedList);
    this.coldStoreService.updateStockOutItems(updatedList).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Stock out items update successfully',
          life: 3000,
        });
        this.updateStockOutLoading = false;
        this.outStockPopupVisible = false;
        // this.getStocksList();
      },
      (error) => {
        this.updateStockOutLoading = false;
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
  editStockInItems() {
    const updatedStockInList = this.stockInList.map((item) => ({
      stockId: item.stockId,
      partyId: item.partyId,
      productTypeId: item.productTypeId,
      farmerName: item.farmerName,
      quantity: item.quantity,
      batchReference: item.batchReference,
      typeId: Number(item.typeId),
      coldStoreShelfId: item.coldStoreShelfId,
      unitId: item.unitId,
      varietyId: Number(item.varietyId),
      startDate: new Date(item.startDate).toISOString(),
      note: item.note,
      businessUnitId: item.businessUnitId,
      roomId: item.roomId,
    }));

    console.log(updatedStockInList);
    this.coldStoreService.updateStockInItems(updatedStockInList).subscribe(
      (dt) => {
        // this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Stock out items update successfully', life: 3000 });
        // this.getStocksList();
      },
      (error) => {
        // this.addLoading = false;
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
  GetOutQuantity(item: any, index: any) {
    this.isTableEdit = true;
    const itemData = this.stockOutList[index];
    const totalOutQuantitySumForValidation = this.stockOutList.reduce(
      (sum, item) => {
        return sum + (Number(item.outQuantity) || 0); // ensure it's a number
      },
      0
    );
    this.validationQuantity = totalOutQuantitySumForValidation;
    // if(this.remainingStock==0){
    //    itemData.outQuantity = item.previousOutQuantity;
    //   return;
    // }
    //decrease remaining stock quantity when outQuantity increase previousOutQuantity
    if (
      item.outQuantity > item.previousOutQuantity &&
      this.validationQuantity <= this.stockOutDetail.quantity
    ) {
      let removeQuantity = item.outQuantity - item.previousOutQuantity;
      // this.totalQuantity=this.totalQuantity+removeQuantity;
      this.remainingStock = this.remainingStock - removeQuantity;
      this.maxOutQuantity = this.remainingStock;
      itemData.previousOutQuantity = item.outQuantity;
      // to get the sum of all quantity
      const totalOutQuantitySum = this.stockOutList.reduce((sum, item) => {
        return sum + (Number(item.outQuantity) || 0); // ensure it's a number
      }, 0);
      this.totalStockOutQuantity = totalOutQuantitySum;
    }
    //increase remaining stock quantity when outQuantity decrease previousOutQuantity
    else if (item.outQuantity <= item.previousOutQuantity) {
      let removeQuantity = item.previousOutQuantity - item.outQuantity;
      this.remainingStock = this.remainingStock + removeQuantity;
      this.maxOutQuantity = this.remainingStock;

      itemData.previousOutQuantity = item.outQuantity;
      // to get the sum of all quantity
      const totalOutQuantitySum = this.stockOutList.reduce((sum, item) => {
        return sum + (Number(item.outQuantity) || 0); // ensure it's a number
      }, 0);
      this.totalStockOutQuantity = totalOutQuantitySum;
    }
    // this._initForm();
  }
  getTotalStockInQuantity() {
    const totalStockInQuantitySum = this.stockInList.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0); // ensure it's a number
    }, 0);
    this.totalQuantity = totalStockInQuantitySum;
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
  showConfirmation(type: string) {
    if (type == 'stockOut') {
      this.confirmationMessage =
        'Are you sure you want to delete this stock out item?';
    } else if (type == 'stockIn') {
      this.confirmationMessage =
        'Are you sure you want to delete this stock in item?';
    }
    this.showConfirmationDialog = true;
  }

  handleDelete() {
    if (this.deletedItemType == 'stockOut') {
      this.deleteStockOutItem();
    } else if (this.deletedItemType === 'stockIn') {
      this.deleteStockInItem();
    }
  }
  deleteStockOutItem() {
    this.showConfirmationDialog = false;

    for (let b = 0; b < this.stockOutList.length; b++) {
      if (this.stockOutList[b].stockId == this.stockOutItemId) {
        this.stockOutList[b].loading = true;
      }
    }
    this.coldStoreService.DeleteStockOutItem(this.stockOutItemId).subscribe(
      (data) => {
        this.stockOutDetail.remainingStock = data.allRemainingStock;
        this.maxOutQuantity = data.allRemainingStock;
        this._initForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Stock out item deleted successfully',
          life: 3000,
        });
        for (let b = 0; b < this.stockOutList.length; b++) {
          if (this.stockOutList[b].stockId == this.stockOutItemId) {
            this.stockOutList[b].loading = false;
            this.totalStockOutQuantity =
              this.totalStockOutQuantity - this.stockOutList[b].outQuantity;
            this.stockOutList.splice(b, 1);
          }
        }
      },
      (error) => {
        for (let b = 0; b < this.stockOutList.length; b++) {
          if (this.stockOutList[b].stockId == this.stockOutItemId) {
            this.stockOutList[b].loading = false;
          }
        }
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 5000,
        });
        console.log(error);
      }
    );
  }
  deleteStockInItem() {
    this.showConfirmationDialog = false;
    for (let b = 0; b < this.stockInList.length; b++) {
      if (this.stockInList[b].stockId == this.stockInItemId) {
        this.stockInList[b].loading = true;
      }
    }
    this.coldStoreService.DeleteStockInItem(this.stockInItemId).subscribe(
      (data) => {
        // this.stockOutDetail.remainingStock=data.remainingStock;
        // this.maxOutQuantity=data.remainingStock;
        // this._initForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Stock in item deleted successfully',
          life: 3000,
        });
        for (let b = 0; b < this.stockInList.length; b++) {
          if (this.stockInList[b].stockId == this.stockInItemId) {
            this.stockInList[b].loading = false;
            this.totalQuantity =
              this.totalQuantity - this.stockInList[b].quantity;

            this.stockInList.splice(b, 1);
          }
        }
      },
      (error) => {
        for (let b = 0; b < this.stockInList.length; b++) {
          if (this.stockInList[b].stockId == this.stockInItemId) {
            this.stockInList[b].loading = false;
          }
        }
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
  handleCancelled() {
    this.showConfirmationDialog = false;
  }
}
