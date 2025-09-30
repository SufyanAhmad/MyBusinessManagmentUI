import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { LoadingComponent } from '../../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../../data-not-found/data-not-found.component';
import { VaccineRecordModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { masterModal } from '../../../../../models/master-model/master-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-health-history',
  imports: [
    CommonModule,
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
  templateUrl: './health-history.component.html',
  styleUrl: './health-history.component.scss',
  providers: [MessageService],
})
export class HealthHistoryComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<VaccineRecordModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  HealthVaccinationRecordList: VaccineRecordModel[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  bgColor: string = '#FFCE3A';
  AnimalList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  key: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addHealthVaccinationRecordForm!: FormGroup;
  displayedColumns: string[] = [
    'recordId',
    'animalId',
    'date',
    'vacName',
    'pur',
    'nextDueDate',
  ];
  constructor(
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  ngOnInit() {
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getHealthVaccinationRecordList();
    }, 0);
    this.loadAnimal();
    this.loadParties();
  }

  getHealthVaccinationRecordList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.HealthVaccinationRecordList = [];
    this.dataSource = new MatTableDataSource(this.HealthVaccinationRecordList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.HealthVaccinationRecordList = [];
          this.dataSource = new MatTableDataSource(
            this.HealthVaccinationRecordList
          );

          let data = {
            searchKey: this.searchKey ?? null,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService
            .getHealthVaccinationRecordBySearchFilter(data)
            .pipe(
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
          this.HealthVaccinationRecordList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: VaccineRecordModel = {
                updatedBy: list[a].updatedBy,
                updatedAt: list[a].updatedAt,
                healthVaccinationRecordId: list[a].healthVaccinationRecordId,
                recordRef: list[a].recordRef,
                supplierName: list[a].supplierName,
                businessUnit: list[a].businessUnit,
                createdBy: list[a].createdBy,
                createdAt: list[a].createdAt,
                supplierId: list[a].supplierId,
                date: list[a].date,
                name: list[a].name,
                purpose: list[a].purpose,
                nextDueDate: list[a].nextDueDate,
                businessUnitId: list[a].businessUnitId,
              };
              this.HealthVaccinationRecordList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(
            this.HealthVaccinationRecordList
          );
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
  addHealthVaccinationRecord() {
    this.addLoading = true;
    this.dairyFarmService
      .addHealthVaccinationRecord(this.addHealthVaccinationRecordForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getHealthVaccinationRecordList();
          this.addHealthVaccinationRecordForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Health Vaccination Record added successfully',
            life: 3000,
          });
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  initForm() {
    this.addHealthVaccinationRecordForm = this.formBuilder.group({
      supplierId: [null, [Validators.required]],
      date: [null, [Validators.required]],
      name: [null, [Validators.required]],
      purpose: [null, [Validators.required]],
      nextDueDate: [null, [Validators.required]],
      businessUnitId: [this.busUnitId],
    });
  }
  addAnimal() {}
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
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
  loadAnimal() {
    this.masterService.getAnimal().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].animalId,
            type: dt[a].animalRef,
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
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
}
