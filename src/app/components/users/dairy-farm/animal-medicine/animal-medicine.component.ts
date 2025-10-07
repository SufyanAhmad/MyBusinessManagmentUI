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
import { AnimalMedicineModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-animal-medicine',
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
  templateUrl: './animal-medicine.component.html',
  styleUrl: './animal-medicine.component.scss',
  providers: [MessageService],
})
export class AnimalMedicineComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<AnimalMedicineModel>;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  busUnitId: any = null;
  AnimalMedicineRecordList: AnimalMedicineModel[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  AnimalList: masterModal[] = [];
  MedicineList: masterModal[] = [];
  key: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  AnimalMedicineForm!: FormGroup;
  displayedColumns: string[] = ['cell1', 'cell2', 'cell3'];
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
      this.getAnimalMedicineList();
    }, 0);
    this.loadAnimal();
  }

  getAnimalMedicineList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.AnimalMedicineRecordList = [];
    this.dataSource = new MatTableDataSource(this.AnimalMedicineRecordList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.AnimalMedicineRecordList = [];
          this.dataSource = new MatTableDataSource(
            this.AnimalMedicineRecordList
          );

          let data = {
            searchKey: this.searchKey,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService
            .getAnimalMedicineBySearchFilter(data)
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
          this.AnimalMedicineRecordList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: AnimalMedicineModel = {
                animalMedicineMappingId: list[a].animalMedicineMappingId,
                animalRef: list[a].animalRef,
                medicineName: list[a].medicineName,
                animalId: list[a].animalId,
                medicineId: list[a].medicineId,
                date: list[a].date,
              };
              this.AnimalMedicineRecordList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(
            this.AnimalMedicineRecordList
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
  addAnimalMedicine() {
    this.addLoading = true;
    this.dairyFarmService
      .addAnimalMedicine(this.AnimalMedicineForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getAnimalMedicineList();
          this.AnimalMedicineForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Animal Medicine added successfully',
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
    this.AnimalMedicineForm = this.formBuilder.group({
      animalId: [null, [Validators.required]],
      medicineId: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }
  onDialogHide() {
    this.AnimalMedicineForm.reset();
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
        this.loadMedicine();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadMedicine() {
    this.masterService.getMedicine().subscribe(
      (res) => {
        let dt = res.data;
        this.MedicineList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].medicineId,
            type: dt[a].name,
          };
          this.MedicineList.push(_data);
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
