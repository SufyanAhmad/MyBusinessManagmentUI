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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { LoadingComponent } from '../../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../../data-not-found/data-not-found.component';
import { AnimalMedicineModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { masterModal } from '../../../../../models/master-model/master-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

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
  animalId: any = null;
  AnimalList: masterModal[] = [];
  MedicineList: masterModal[] = [];
  key: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  AnimalMedicineForm!: FormGroup;
  displayedColumns: string[] = ['cell1', 'cell2', 'cell3'];
  constructor(
    private route: ActivatedRoute,
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  ngOnInit() {
    this.animalId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
    this.getAnimalMedicineList();
    this.loadMedicine();
  }

  getAnimalMedicineList() {
    this.isLoadingResults = true;
    this.AnimalMedicineRecordList = [];
    this.dataSource = new MatTableDataSource(this.AnimalMedicineRecordList);

    this.dairyFarmService.GetAnimalMedicineByAnimalId(this.animalId).subscribe(
      (resp: any) => {
        this.isLoadingResults = false;
        this.AnimalMedicineRecordList = [];

        if (resp && resp.data && resp.data.length > 0) {
          for (let a = 0; a < resp.data.length; a++) {
            const item = resp.data[a];
            let feed: AnimalMedicineModel = {
              animalMedicineMappingId: item.animalMedicineMappingId,
              animalRef: item.animalRef,
              medicineName: item.medicineName,
              animalId: item.animalId,
              medicineId: item.medicineId,
              date: item.date,
            };
            this.AnimalMedicineRecordList.push(feed);
          }
        }

        this.dataSource = new MatTableDataSource(this.AnimalMedicineRecordList);
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
    this.AnimalMedicineForm = this.formBuilder.group({
      animalId: [this.animalId],
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
  }
}
