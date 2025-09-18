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
import { catchError, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { FeedModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-feed',
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
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  providers: [MessageService],
})
export class FeedComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<FeedModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  feedList: FeedModel[] = [];
  BusinessUnits: masterModal[] = [];
  AnimalList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  businessUnitId: any = null;
  key: any = null;
  businessUnitName: any = '';
  bgColor: string = '#FFCE3A';
  // for add feed popup
  addLoading: boolean = false;
  visible: boolean = false;
  addFeedModel!: FormGroup;
  displayedColumns: string[] = [
    'feedId',
    'animalId',
    'feedName',
    'quantity',
    'feedTime',
    'note',
  ];
  constructor(
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  ngOnInit() {
    this.busUnitId = localStorage.getItem('DF_businessUnitId');
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');
    this.loadBusinessUnits();
    this.loadParties();
    this.loadAnimal();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getFeedList();
    }, 0);
  }
  getFeedList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.feedList = [];
    this.dataSource = new MatTableDataSource(this.feedList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.feedList = [];
          this.dataSource = new MatTableDataSource(this.feedList);

          let data = {
            searchKey: this.searchKey ?? null,
            businessUnitId: this.busUnitId ?? null,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getFeedBySearchFilter(data).pipe(
            catchError((resp: any) => {
              if (resp.status == 401) {
                this.accountService.doLogout();
                this.router.navigateByUrl('/');
              }
              return of({ data: { totalCount: 0, list: [] } });
            })
          );
        }),
        map((resp: any) => {
          if (!resp || !resp.data) {
            return [];
          }
          this.resultsLength = resp.data.totalCount;
          return resp.data.list;
        })
      )
      .subscribe(
        (list) => {
          this.feedList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: FeedModel = {
                feedId: list[a].feedId,
                feedRef: list[a].feedRef,
                animalRef: list[a].animalRef,
                supplierName: list[a].supplierName,
                businessUnit: list[a].businessUnit,
                animalId: list[a].animalId,
                supplierId: list[a].supplierId,
                name: list[a].name,
                quantity: list[a].quantity,
                feedTime: list[a].feedTime,
                note: list[a].note,
                businessUnitId: list[a].businessUnitId,
              };
              this.feedList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(this.feedList);
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
  initForm() {
    this.addFeedModel = this.formBuilder.group({
      animalId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
      feedTime: [null, [Validators.required]],
      note: [null, [Validators.required]],
      businessUnitId: [null, [Validators.pattern]],
    });
  }
  loadBusinessUnits() {
    this.masterService.getBusinessUnitTypesById(3).subscribe(
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
  loadAnimal() {
    this.masterService.getAnimal().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalList.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadParties() {
    this.masterService.getParties(1).subscribe(
      (res) => {
        var dt = res;
        this.SupplierList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name,
          };
          this.SupplierList.push(_data);
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
