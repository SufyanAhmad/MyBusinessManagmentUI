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
import { Router, RouterLink } from '@angular/router';
import { catchError, map, merge, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { StockInModel } from '../../../../../models/cold-store-model/cold-store-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';
import { LoadingComponent } from '../../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../../data-not-found/data-not-found.component';

@Component({
  selector: 'app-stock-in',
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
  ],
  templateUrl: './stock-in.component.html',
  styleUrl: './stock-in.component.scss',
  providers: [MessageService],
})
export class StockInComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<StockInModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockInList: StockInModel[] = [];
  businessUnitName: any = '';

  displayedColumns: string[] = [
    'batch',
    'name',
    'prodType',
    'farName',
    'quantity',
    'type',
    'rackNo',
    'unitType',
    'variety',
    'date',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private messageService: MessageService,
    private coldStoreService: ColdStoreServiceService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getStocksInList();
    }, 0);
  }
  getStocksInList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.stockInList = [];
    this.dataSource = new MatTableDataSource(this.stockInList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.stockInList = [];
          this.dataSource = new MatTableDataSource(this.stockInList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          let data = {
            searchKey: this.searchKey,
            businessTypeId: null,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.coldStoreService.getStockInBySearchFilter(data).pipe(
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
          this.stockInList = [];
          for (let a = 0; a < data.list.length; a++) {
            let stockIn: StockInModel = {
              stockId: data.list[a].stockId,
              partyId: data.list[a].partyId,
              party: data.list[a].party,
              productTypeId: data.list[a].productTypeId,
              productType: data.list[a].productType,
              farmerName: data.list[a].farmerName,
              quantity: data.list[a].quantity,
              batchReference: data.list[a].batchReference,
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
              type: data.list[a].type,
              roomId: data.list[a].roomId,
              room: data.list[a].room,
              roomNo: data.list[a].roomNo,
            };
            this.stockInList.push(stockIn);
          }
          this.dataSource = new MatTableDataSource(this.stockInList);
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
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }

  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
}
