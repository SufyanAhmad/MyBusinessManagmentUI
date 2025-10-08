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
import { MedicineModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-medicine',
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
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.scss',
  providers: [MessageService],
})
export class MedicineComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<MedicineModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  MedicineRecordList: MedicineModel[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  AnimalList: masterModal[] = [];
  MedicineTypeList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  key: any = null;
  medicineTypeId: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  medicineForm!: FormGroup;
  displayedColumns: string[] = [
    'cell1',
    'cell2',
    'cell3',
    'cell4',
    'cell5',
    'cell6',
    'cell7',
    'cell8',
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
      this.getMedicineList();
    }, 0);
    this.loadParties();
  }

  getMedicineList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.MedicineRecordList = [];
    this.dataSource = new MatTableDataSource(this.MedicineRecordList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.MedicineRecordList = [];
          this.dataSource = new MatTableDataSource(this.MedicineRecordList);

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            medicineTypeId: this.medicineTypeId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getMedicineBySearchFilter(data).pipe(
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
          this.MedicineRecordList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: MedicineModel = {
                medicineId: list[a].medicineId,
                medicineType: list[a].medicineType,
                supplierName: list[a].supplierName,
                businessUnit: list[a].businessUnit,
                createdBy: list[a].createdBy,
                createdAt: list[a].createdAt,
                name: list[a].name,
                dosage: list[a].dosage,
                expiryDate: list[a].expiryDate,
                quantity: list[a].quantity,
                medicineTypeId: list[a].medicineTypeId,
                price: list[a].price,
                note: list[a].note,
                supplierId: list[a].supplierId,
                businessUnitId: list[a].businessUnitId,
              };
              this.MedicineRecordList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(this.MedicineRecordList);
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
  addMedicine() {
    this.addLoading = true;
    this.dairyFarmService.addMedicine(this.medicineForm.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getMedicineList();
        this.medicineForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Medicine added successfully',
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
    this.medicineForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      dosage: [null],
      expiryDate: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      medicineTypeId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      note: [null],
      businessUnitId: [this.busUnitId],
    });
  }
  onDialogHide() {
    this.medicineForm.reset();
  }
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
        this.loadMedicineType();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadMedicineType() {
    this.masterService.getMedicineType().subscribe(
      (res) => {
        let dt = res.data;
        this.MedicineTypeList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.MedicineTypeList.push(_data);
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
    this.medicineTypeId = null;
  }
}
