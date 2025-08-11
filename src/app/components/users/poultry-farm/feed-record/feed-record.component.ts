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
  feedRecordModel,
  LiveStockModel,
  VaccinationModel,
} from '../../../../models/poultry-farm-model/poultry-farm-model';

@Component({
  selector: 'app-feed-record',
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
  templateUrl: './feed-record.component.html',
  styleUrl: './feed-record.component.scss',
  providers: [MessageService],
})
export class FeedRecordComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  flockRef: masterModal[] = [];
  feedTypes: masterModal[] = [];
  visible: boolean = false;
  showConfirmDialog: boolean = false;
  addLoading: boolean = false;
  businessUnitId: any = null;
  livestockBatchId: any = null;
  resultsLength: any = 0;
  confirmationMessage: string = '';
  businessUnitName: any = '';
  partiesTypes: masterModal[] = [];
  addFeedRecordModel!: FormGroup;
  displayedColumns: string[] = [
    'ref',
    'flock',
    'date',
    'feedType',
    'quantity',
    'supplier',
    'price',
  ];
  feedRecordList: feedRecordModel[] = [];
  dataSource!: MatTableDataSource<feedRecordModel>;

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
    this.loadFlockRef();
    this.initForm();
    this.loadPartiesTypes();
  }
  initForm() {
    this.addFeedRecordModel = this.formBuilder.group({
      businessUnitId: [this.businessUnitId, [Validators.required]],
      feedTypeId: [null, [Validators.required]],
      date: [new Date().toISOString().substring(0, 10), [Validators.required]],
      flockId: [null, [Validators.required]],
      quantityKg: [
        1,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      supplierId: ['', [Validators.required]],
      price: [
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
      this.getFeedRecordList();
    }, 0);
  }
  getFeedRecordList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.feedRecordList = [];
    this.dataSource = new MatTableDataSource(this.feedRecordList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.feedRecordList = [];
          this.dataSource = new MatTableDataSource(this.feedRecordList);

          if (this.searchKey == null || this.searchKey == '') {
            this.searchKey = null;
          }

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.businessUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.poultryFarmService.GetFeedRecordBySearchFilter(data).pipe(
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
            let fRecord: feedRecordModel = {
              feedRecordId: dt[a].feedRecordId,
              ref: dt[a].ref,
              flockId: dt[a].flockId,
              flockRef: dt[a].flockRef,
              date: dt[a].date,
              feedTypeId: dt[a].feedTypeId,
              feedType: dt[a].feedType,
              quantityKg: dt[a].quantityKg,
              businessUnitId: dt[a].businessUnitId,
              businessUnit: dt[a].businessUnit,
              price: dt[a].price,
              supplierId: dt[a].supplierId,
              supplier: dt[a].supplier,
            };
            this.feedRecordList.push(fRecord);
          }
          this.dataSource = new MatTableDataSource(this.feedRecordList);
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
        this.getFeedRecordList();
      }
    }
  }

  addFeedRecord() {
    this.addLoading = true;
    this.poultryFarmService
      .AddFeedRecord(this.addFeedRecordModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getFeedRecordList();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Feed record added successfully',
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
        this.loadFeedTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadFeedTypes() {
    this.masterService.getFeedTypes().subscribe(
      (res) => {
        var dt = res;
        this.feedTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedTypeId,
            type: dt[a].feedType,
          };
          this.feedTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
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
    this.ngAfterViewInit();
  }
}
