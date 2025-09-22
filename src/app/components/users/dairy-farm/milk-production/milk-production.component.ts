import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { masterModal } from '../../../../models/master-model/master-model';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import {
  MilkProductionModel,
  StockOutModel,
} from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-milk-production',
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
  ],
  templateUrl: './milk-production.component.html',
  styleUrl: './milk-production.component.scss',
  providers: [MessageService],
})
export class MilkProductionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<MilkProductionModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  MilkProductionList: MilkProductionModel[] = [];
  BusinessUnits: masterModal[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  bgColor: string = '#FFCE3A';
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addAnimalModel!: FormGroup;
  displayedColumns: string[] = [
    'recordId',
    'animalId',
    'animalName',
    'date',
    'morningL',
    'eveningL',
    'totalL',
    'fat',
    'snf',
    'status',
  ];
  constructor(
    private route: ActivatedRoute,
    private coldStoreService: ColdStoreServiceService,
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private router: Router
  ) {}
  ngOnInit() {
    this.busUnitId = localStorage.getItem('DF_businessUnitId');
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');
    this.loadBusinessUnits();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getMilkProductionList();
    }, 0);
  }
  getMilkProductionList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.MilkProductionList = [];
    this.dataSource = new MatTableDataSource(this.MilkProductionList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.MilkProductionList = [];
          this.dataSource = new MatTableDataSource(this.MilkProductionList);

          let data = {
            searchKey: this.searchKey || null,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService
            .getMilkProductionBySearchFilter(data)
            .pipe(
              catchError((resp: any) => {
                if (resp.status == 401) {
                  this.accountService.doLogout();
                  this.router.navigateByUrl('/');
                }
                return of(null);
              })
            );
        }),
        map((resp: any) => {
          this.isRateLimitReached = resp === null;
          if (!resp || !resp.data) {
            return { list: [], totalCount: 0 };
          }
          this.resultsLength = resp.data.totalCount || 0;
          return resp.data;
        })
      )
      .subscribe(
        (data) => {
          this.MilkProductionList = [];
          if (data.list && data.list.length > 0) {
            for (let a = 0; a < data.list.length; a++) {
              let stockOut: MilkProductionModel = {
                updatedBy: data.list[a].updatedBy,
                updatedAt: data.list[a].updatedAt,
                milkProductionId: data.list[a].milkProductionId,
                milkProductionRef: data.list[a].milkProductionRef,
                animalRef: data.list[a].animalRef,
                businessUnit: data.list[a].businessUnit,
                createdBy: data.list[a].createdBy,
                createdAt: data.list[a].createdAt,
                animalId: data.list[a].animalId,
                date: data.list[a].date,
                morning: data.list[a].morning,
                evening: data.list[a].evening,
                total: data.list[a].total,
                businessUnitId: data.list[a].businessUnitId,
              };
              this.MilkProductionList.push(stockOut);
            }
          }

          this.dataSource = new MatTableDataSource(this.MilkProductionList);
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

  addAnimal() {}
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }

  loadBusinessUnits() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.BusinessUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.BusinessUnits.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
}
