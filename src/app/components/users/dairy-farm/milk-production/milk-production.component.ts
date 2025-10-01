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
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { MilkProductionModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-milk-production',
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
  templateUrl: './milk-production.component.html',
  styleUrl: './milk-production.component.scss',
  providers: [MessageService],
})
export class MilkProductionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<MilkProductionModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  MilkProductionList: MilkProductionModel[] = [];
  AnimalList: masterModal[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  isActive: boolean = true;
  bgColor: string = '#FFCE3A';
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addMilkProductionForm!: FormGroup;
  displayedColumns: string[] = [
    'recordId',
    'animalId',
    'animalName',
    'date',
    'morningL',
    'eveningL',
    'totalL',
    'fat',
    'snf',
  ];
  constructor(
    private messageService: MessageService,
    private masterService: MasterService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
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
      this.getMilkProductionList();
    }, 0);
    this.loadAnimal();
  }
  getMilkProductionList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.MilkProductionList = [];
    this.dataSource = new MatTableDataSource(this.MilkProductionList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.MilkProductionList = [];
          this.dataSource = new MatTableDataSource(this.MilkProductionList);

          let data = {
            searchKey: this.searchKey || null,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService
            .getMilkProductionBySearchFilter(data)
            .pipe(
              catchError((resp: any) => {
                if (resp.status == 401) {
                  this.accountService.doLogout();
                  this.router.navigateByUrl('/');
                }
                return of(null);
              })
            );
        }),
        map((resp: any) => {
          this.isRateLimitReached = resp === null;
          if (!resp || !resp.data) {
            return { list: [], totalCount: 0 };
          }
          this.resultsLength = resp.data.totalCount || 0;
          return resp.data;
        })
      )
      .subscribe(
        (data) => {
          this.MilkProductionList = [];
          if (data.list && data.list.length > 0) {
            for (let a = 0; a < data.list.length; a++) {
              let stockOut: MilkProductionModel = {
                updatedBy: data.list[a].updatedBy,
                updatedAt: data.list[a].updatedAt,
                milkProductionId: data.list[a].milkProductionId,
                milkProductionRef: data.list[a].milkProductionRef,
                animalRef: data.list[a].animalRef,
                businessUnit: data.list[a].businessUnit,
                createdBy: data.list[a].createdBy,
                createdAt: data.list[a].createdAt,
                animalId: data.list[a].animalId,
                date: data.list[a].date,
                morning: data.list[a].morning,
                evening: data.list[a].evening,
                total: data.list[a].total,
                businessUnitId: data.list[a].businessUnitId,
              };
              this.MilkProductionList.push(stockOut);
            }
          }

          this.dataSource = new MatTableDataSource(this.MilkProductionList);
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
  AddMilkProduction() {
    this.addLoading = true;
    this.dairyFarmService
      .addMilkProduction(this.addMilkProductionForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getMilkProductionList();
          this.addMilkProductionForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Milk Production added successfully',
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
    this.addMilkProductionForm = this.formBuilder.group({
      animalId: [null, [Validators.required]],
      date: [null, [Validators.required]],
      morning: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      evening: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      total: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      isActive: [true],
      businessUnitId: [this.busUnitId],
    });
  }
  onDialogHide() {
    this.addMilkProductionForm.reset();
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
