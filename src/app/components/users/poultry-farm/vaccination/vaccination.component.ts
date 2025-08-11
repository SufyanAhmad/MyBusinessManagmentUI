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
import { PoultryFarmService } from '../../../../services/poultry-farm-service/poultry-farm.service';
import {
  LiveStockModel,
  VaccinationModel,
} from '../../../../models/poultry-farm-model/poultry-farm-model';

@Component({
  selector: 'app-vaccination',
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
  templateUrl: './vaccination.component.html',
  styleUrl: './vaccination.component.scss',
  providers: [MessageService],
})
export class VaccinationComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  flockRef: masterModal[] = [];
  visible: boolean = false;
  showConfirmDialog: boolean = false;
  addLoading: boolean = false;
  businessUnitId: any = null;
  livestockBatchId: any = null;
  resultsLength: any = 0;
  confirmationMessage: string = '';
  businessUnitName: any = '';
  addVaccinationModel!: FormGroup;
  displayedColumns: string[] = [
    'name',
    'batch',
    'vacName',
    'date',
    'createBy',
    'supplier',
    'price',
  ];
  vaccinationList: VaccinationModel[] = [];
  partiesTypes: masterModal[] = [];
  dataSource!: MatTableDataSource<VaccinationModel>;

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
    this.addVaccinationModel = this.formBuilder.group({
      businessUnitId: [this.businessUnitId, [Validators.required]],
      vaccineName: [null, [Validators.required]],
      givenDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      flockId: [null, [Validators.required]],
      givenBy: [null, [Validators.required]],
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
      this.getVaccinatiomBySearch();
    }, 0);
  }
  getVaccinatiomBySearch() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.vaccinationList = [];
    this.dataSource = new MatTableDataSource(this.vaccinationList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.vaccinationList = [];
          this.dataSource = new MatTableDataSource(this.vaccinationList);

          if (this.searchKey == null || this.searchKey == '') {
            this.searchKey = null;
          }

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.businessUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.poultryFarmService
            .GetVaccinationBySearchFilter(data)
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
            let vaccination: VaccinationModel = {
              vaccinationId: dt[a].vaccinationId,
              refCount: dt[a].refCount,
              ref: dt[a].ref,
              businessUnitName: dt[a].businessUnitName,
              flockRef: dt[a].flockRef,
              createdAt: dt[a].createdAt,
              createdBy: dt[a].createdBy,
              vaccineName: dt[a].vaccineName,
              businessUnitId: dt[a].businessUnitId,
              flockId: dt[a].flockId,
              givenDate: dt[a].givenDate,
              givenBy: dt[a].givenBy,
              price: dt[a].price,
              supplierId: dt[a].supplierId,
              supplier: dt[a].supplier,
            };

            this.vaccinationList.push(vaccination);
          }
          this.dataSource = new MatTableDataSource(this.vaccinationList);
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
        this.getVaccinatiomBySearch();
      }
    }
  }

  addVaccination() {
    this.addLoading = true;
    this.poultryFarmService
      .AddVaccination(this.addVaccinationModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getVaccinatiomBySearch();
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
