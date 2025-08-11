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
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { AccountService } from '../../../../services/account-service/account.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { masterModal } from '../../../../models/master-model/master-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PoultryFarmService } from '../../../../services/poultry-farm-service/poultry-farm.service';
import { flockModel } from '../../../../models/poultry-farm-model/poultry-farm-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-flocks',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    DataNotFoundComponent,
    LoadingComponent,
    ToastModule,
    SelectModule,
  ],
  templateUrl: './flocks.component.html',
  styleUrl: './flocks.component.scss',
  providers: [MessageService],
})
export class FlocksComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  liveBatchList: masterModal[] = [];
  visible: boolean = false;
  addLoading: boolean = false;
  businessUnitId: any = null;
  livestockBatchId: any = null;
  resultsLength: any = 0;
  businessUnitName: any = '';
  addFlockModel!: FormGroup;
  displayedColumns: string[] = [
    'ref',
    'name',
    'quantity',
    'date',
    'gender',
    'supplier',
    'price',
  ];
  flockList: flockModel[] = [];
  partiesTypes: masterModal[] = [];
  dataSource!: MatTableDataSource<flockModel>;
  constructor(
    private formBuilder: FormBuilder,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    // this.loadLiveBatchNames();
    this.initForm();
    this.loadPartiesTypes();
  }
  initForm() {
    this.addFlockModel = this.formBuilder.group({
      businessUnitId: [this.businessUnitId, [Validators.required]],
      quantity: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
        ],
      ],
      breed: [null, [Validators.required]],
      arrivalDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      isHen: [true, [Validators.required]],
      price: [0, [Validators.required]],
      supplierId: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getFlockList();
    }, 0);
  }
  getFlockList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.flockList = [];
    this.dataSource = new MatTableDataSource(this.flockList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.flockList = [];
          this.dataSource = new MatTableDataSource(this.flockList);

          if (this.searchKey == null || this.searchKey == '') {
            this.searchKey = null;
          }

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.businessUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.poultryFarmService.GetFlocksBySearchFilter(data).pipe(
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
            let vaccination: flockModel = {
              flockId: dt[a].flockId,
              ref: dt[a].ref,
              breed: dt[a].breed,
              quantity: dt[a].quantity,
              arrivalDate: dt[a].arrivalDate,
              isHen: dt[a].isHen,
              businessUnitId: dt[a].businessUnitId,
              businessUnit: dt[a].businessUnit,
              price: dt[a].price,
              supplierId: dt[a].supplierId,
              supplier: dt[a].supplier,
            };
            this.flockList.push(vaccination);
          }
          this.dataSource = new MatTableDataSource(this.flockList);
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
        this.getFlockList();
      }
    }
  }

  addFlock() {
    this.addLoading = true;
    this.poultryFarmService.AddFlock(this.addFlockModel.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getFlockList();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Flock added successfully',
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
  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
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
}
