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
import { AnimalHealthVaccination } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-vaccination',
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
  templateUrl: './vaccination.component.html',
  styleUrl: './vaccination.component.scss',
  providers: [MessageService],
})
export class VaccinationComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<AnimalHealthVaccination>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  animalId: any = null;
  stockId: any = null;
  busUnitId: any = null;
  HealthRecordList: AnimalHealthVaccination[] = [];
  AnimalList: masterModal[] = [];
  HealthVaccinationList: masterModal[] = [];
  BusinessUnits: masterModal[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addVaccinationForm!: FormGroup;
  displayedColumns: string[] = ['cell2', 'cell3', 'cell4', 'cell5'];
  constructor(
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getVaccinationRecordList();
    }, 0);
    this.loadAnimal();
  }
  getVaccinationRecordList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.HealthRecordList = [];
    this.dataSource = new MatTableDataSource(this.HealthRecordList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.HealthRecordList = [];
          this.dataSource = new MatTableDataSource(this.HealthRecordList);

          let data = {
            searchKey: this.searchKey ?? null,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getVaccinationBySearchFilter(data).pipe(
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
          if (resp.data.list) {
            this.resultsLength = resp.data.totalCount ?? resp.data.list.length;
            return resp.data.list;
          }
        })
      )
      .subscribe(
        (list) => {
          this.HealthRecordList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: AnimalHealthVaccination = {
                animalHealthVaccinationMappingId:
                  list[a].animalHealthVaccinationMappingId,
                animalHealthVaccinationStatusId:
                  list[a].animalHealthVaccinationStatusId,
                animalHealthVaccinationStatus:
                  list[a].animalHealthVaccinationStatus,
                createdAt: list[a].createdAt,
                animalRef: list[a].animalRef,
                animalId: list[a].animalId,
                name: list[a].name,
                date: list[a].date,
                healthVaccinationRecordId: list[a].healthVaccinationRecordId,
              };
              this.HealthRecordList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(this.HealthRecordList);
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
      .addAnimalHealthVaccinationRecord(this.addVaccinationForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getVaccinationRecordList();
          this.addVaccinationForm.reset();
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
    this.addVaccinationForm = this.formBuilder.group({
      animalId: [null, [Validators.required]],
      healthVaccinationRecordId: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }
  onDialogHide() {
    this.addVaccinationForm.reset();
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
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
        this.loadHealthVaccinationRecords();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadHealthVaccinationRecords() {
    this.masterService.getHealthVaccinationRecords().subscribe(
      (res) => {
        let dt = res.data;
        this.HealthVaccinationList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].healthVaccinationRecordId,
            type: dt[a].name,
          };
          this.HealthVaccinationList.push(_data);
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
