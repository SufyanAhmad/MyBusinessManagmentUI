import { Component } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { LoadingComponent } from '../../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../../data-not-found/data-not-found.component';
import { HealthRecordModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
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
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<HealthRecordModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  HealthRecordList: HealthRecordModel[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  animalId: any = null;
  AnimalList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  today: string = new Date().toISOString().split('T')[0];
  key: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addHealthVaccinationRecordForm!: FormGroup;
  displayedColumns: string[] = [
    'cell1',
    'cell2',
    'cell3',
    'cell4',
    'cell5',
    'cell6',
    'cell7',
  ];
  constructor(
    private route: ActivatedRoute,
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
    this.getHealthHistoryRecordList();
  }

  getHealthHistoryRecordList() {
    this.isLoadingResults = true;
    this.HealthRecordList = [];
    this.dataSource = new MatTableDataSource(this.HealthRecordList);

    this.dairyFarmService.GetHealthRecordByAnimalId(this.animalId).subscribe(
      (resp: any) => {
        this.HealthRecordList = [];
        if (resp && resp.data && resp.data.length > 0) {
          this.HealthRecordList = resp.data.map((item: any) => {
            let record: HealthRecordModel = {
              animalHealthId: item.animalHealthId,
              animalHealthRef: item.animalHealthRef,
              createdBy: item.createdBy,
              createdAt: item.createdAt,
              animalRef: item.animalRef,
              businessUnit: item.businessUnit,
              animalId: item.animalId,
              weight: item.weight,
              temperature: item.temperature,
              illnessNotes: item.illnessNotes,
              medicineTreatment: item.medicineTreatment,
              businessUnitId: item.businessUnitId,
              lastCheckupDate: item.lastCheckupDate,
              remarks: item.remarks,
            };
            return record;
          });
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
      .addHealthRecord(this.addHealthVaccinationRecordForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getHealthHistoryRecordList();
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
      animalId: [this.animalId],
      businessUnitId: [this.busUnitId],
      weight: [null, [Validators.required]],
      temperature: [null, [Validators.required]],
      illnessNotes: [null, [Validators.required]],
      medicineTreatment: [null, [Validators.required]],
      lastCheckupDate: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
    });
  }
  onDialogHide() {
    this.addHealthVaccinationRecordForm.reset();
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }

  ResetFilter() {
    this.searchKey = null;
  }
}
