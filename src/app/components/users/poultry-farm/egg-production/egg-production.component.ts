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
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { AccountService } from '../../../../services/account-service/account.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
import { PoultryFarmService } from '../../../../services/poultry-farm-service/poultry-farm.service';
import {
  LiveStockModel,
  eggProductionModel,
} from '../../../../models/poultry-farm-model/poultry-farm-model';

@Component({
  selector: 'app-egg-production',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SelectModule,
    DataNotFoundComponent,
    LoadingComponent,
    ToastModule,
  ],
  templateUrl: './egg-production.component.html',

  styleUrl: './egg-production.component.scss',
  providers: [MessageService],
})
export class EggProductionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  liveBatchList: masterModal[] = [];
  flockRef: masterModal[] = [];
  visible: boolean = false;
  showConfirmDialog: boolean = false;
  addLoading: boolean = false;
  businessUnitId: any = null;
  flockId: any = null;
  livestockBatchId: any = null;
  resultsLength: any = 0;
  confirmationMessage: string = '';
  businessUnitName: any = '';
  addEggProductionModel!: FormGroup;
  displayedColumns: string[] = [
    'ref',
    'flock',
    'date',
    'totEgg',
    'ferEgg',
    'broEgg',
  ];
  eggProductionList: eggProductionModel[] = [];
  dataSource!: MatTableDataSource<eggProductionModel>;

  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.loadLiveBatchNames();
    this.loadFlockRef();
    this.initForm();
  }
  initForm() {
    this.addEggProductionModel = this.formBuilder.group({
      flockId: ['', [Validators.required]],
      businessUnitId: [this.businessUnitId, [Validators.required]],
      date: [new Date().toISOString().substring(0, 10), [Validators.required]],
      totalEggs: [
        1,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      fertileEggs: [
        1,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      brokenEggs: [
        1,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getLiveStockBatchList();
    }, 0);
  }
  getLiveStockBatchList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.eggProductionList = [];
    this.dataSource = new MatTableDataSource(this.eggProductionList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.eggProductionList = [];
          this.dataSource = new MatTableDataSource(this.eggProductionList);

          if (this.searchKey == null || this.searchKey == '') {
            this.searchKey = null;
          }

          let data = {
            searchKey: this.searchKey,
            // businessUnitId: this.businessUnitId,
            // livestockBatchId: this.livestockBatchId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.poultryFarmService
            .GetEggProductionBySearchFilter(data)
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
          this.resultsLength = data.data.totalCount;
          return data.data;
        })
      )
      .subscribe(
        (data) => {
          let dt = data.list;
          for (let a = 0; a < dt.length; a++) {
            let eggProduction: eggProductionModel = {
              eggProductionId: dt[a].eggProductionId,
              refCount: dt[a].refCount,
              ref: dt[a].ref,
              businessUnitName: dt[a].businessUnitName,
              flockRef: dt[a].flockRef,
              createdAt: dt[a].createdAt,
              createdBy: dt[a].createdBy,
              flockId: dt[a].flockId,
              businessUnitId: dt[a].businessUnitId,
              totalEggs: dt[a].totalEggs,
              fertileEggs: dt[a].fertileEggs,
              brokenEggs: dt[a].brokenEggs,
              date: dt[a].date,
            };
            this.eggProductionList.push(eggProduction);
          }
          this.dataSource = new MatTableDataSource(this.eggProductionList);
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
        this.getLiveStockBatchList();
      }
    }
  }

  addEggProduction() {
    this.addLoading = true;
    this.poultryFarmService
      .AddEggProduction(this.addEggProductionModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getLiveStockBatchList();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Vaccination added successfully',
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
  loadLiveBatchNames() {
    this.poultryFarmService.getLiveBatchNames().subscribe(
      (res) => {
        var dt = res;
        this.liveBatchList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].livestockBatchId,
            type: dt[a].breed,
          };
          this.liveBatchList.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  // loadFlocks() {
  //   this.masterService.getFlocksById(this.businessUnitId).subscribe(
  //     (res) => {
  //       var dt = res;
  //       this.FlockList = [];

  //       for (let a = 0; a < dt.length; a++) {
  //         let _data: masterModal = {
  //           id: dt[a].flockId,
  //           type: dt[a].flockRef,
  //         };
  //         this.FlockList.push(_data);
  //       }
  //     },

  //     (error) => {
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
  loadFlockRef() {
    this.masterService.getFlockRef(this.businessUnitId).subscribe(
      (res) => {
        var dt = res;
        this.flockRef = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].flockId,
            type: dt[a].flockRef,
          };
          this.flockRef.push(_data);
        }

        // this.loadFeedTypes();
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
    this.businessUnitId = null;
    this.livestockBatchId = null;
    this.ngAfterViewInit();
  }
}
