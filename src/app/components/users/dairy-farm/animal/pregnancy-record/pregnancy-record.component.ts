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
import { PregnancyRecordModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { masterModal } from '../../../../../models/master-model/master-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-pregnancy-record',
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
  templateUrl: './pregnancy-record.component.html',
  styleUrl: './pregnancy-record.component.scss',
  providers: [MessageService],
})
export class PregnancyRecordComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<PregnancyRecordModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  key: any = null;
  stockId: any = null;
  busUnitId: any = null;
  pregnancyRecordList: PregnancyRecordModel[] = [];
  AnimalList: masterModal[] = [];
  Breeds: masterModal[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  breedId: any = null;
  delivered: boolean = true;
  animalId: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  pregnancyRecordForm!: FormGroup;
  displayedColumns: string[] = [
    'recordId',
    'praDate',
    'expDate',
    'actDate',
    'status',
  ];
  constructor(
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.animalId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getPregnancyRecordList();
    }, 0);
    this.loadAnimal();
    this.loadBreeds();
  }
  getPregnancyRecordList() {
    this.isLoadingResults = true;
    this.pregnancyRecordList = [];
    this.dataSource = new MatTableDataSource(this.pregnancyRecordList);
    this.dairyFarmService.GetPregnancyRecordByAnimalId(this.animalId).subscribe(
      (resp: any) => {
        this.pregnancyRecordList = [];
        if (resp && resp.data && resp.data.length > 0) {
          this.pregnancyRecordList = resp.data.map((item: any) => {
            let record: PregnancyRecordModel = {
              updatedBy: item.updatedBy,
              updatedAt: item.updatedAt,
              pregnancyBirthRecordId: item.pregnancyBirthRecordId,
              recordRef: item.recordRef,
              animalRef: item.animalRef,
              breedRef: item.breedRef,
              businessUnit: item.businessUnit,
              createdBy: item.createdBy,
              createdAt: item.createdAt,
              animalId: item.animalId,
              breedId: item.breedId,
              pregnantDate: item.pregnantDate,
              expectedDelivery: item.expectedDelivery,
              actualDelivery: item.actualDelivery,
              delivered: item.delivered,
              businessUnitId: item.businessUnitId,
            };
            return record;
          });
        }

        this.dataSource = new MatTableDataSource(this.pregnancyRecordList);
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

  addPregnancyRecord() {
    this.addLoading = true;
    this.dairyFarmService
      .addPregnancyRecord(this.pregnancyRecordForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getPregnancyRecordList();
          this.pregnancyRecordForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Pregnancy Record added successfully',
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
    this.pregnancyRecordForm = this.formBuilder.group({
      animalId: [this.animalId],
      breedId: [null],
      pregnantDate: [null, [Validators.required]],
      expectedDelivery: [null, [Validators.required]],
      actualDelivery: [null, [Validators.required]],
      delivered: [null, [Validators.required]],
      businessUnitId: [this.busUnitId],
    });
  }
  onDialogHide() {
    this.pregnancyRecordForm.reset();
  }
  getNextDate = () =>
    this.pregnancyRecordForm.get('pregnantDate')?.value
      ? new Date(
          new Date(this.pregnancyRecordForm.get('pregnantDate')?.value).setDate(
            new Date(
              this.pregnancyRecordForm.get('pregnantDate')?.value
            ).getDate() + 1
          )
        )
          .toISOString()
          .split('T')[0]
      : null;
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
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBreeds() {
    this.masterService.getBreeds().subscribe(
      (res) => {
        var dt = res.data;
        this.Breeds = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].breedId,
            type: dt[a].breedRef,
          };
          this.Breeds.push(_data);
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
