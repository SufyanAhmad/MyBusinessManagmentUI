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
import { BreedModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-breed',
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
  templateUrl: './breed.component.html',
  styleUrl: './breed.component.scss',
  providers: [MessageService],
})
export class BreedComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<BreedModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  BreedList: BreedModel[] = [];
  BusinessUnits: masterModal[] = [];
  AnimalTypes: masterModal[] = [];
  businessUnitId: any = null;
  businessUnitName: any = '';
  key: any = null;
  bgColor: string = '#FFCE3A';
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addBreedModel!: FormGroup;
  displayedColumns: string[] = ['breedName', 'type', 'origin', 'note'];
  constructor(
    private route: ActivatedRoute,
    private dairyFarmService: DairyFarmService,
    private masterService: MasterService,
    private accountService: AccountService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.busUnitId = localStorage.getItem('DF_businessUnitId');
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');
    this.loadBusinessUnits();
    this.loadAnimalTypes();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getBreedList();
    }, 0);
  }
  getBreedList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.BreedList = [];
    this.dataSource = new MatTableDataSource(this.BreedList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.BreedList = [];
          this.dataSource = new MatTableDataSource(this.BreedList);

          let data = {
            searchKey: this.searchKey ?? null,
            businessUnitId: this.busUnitId ?? null,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getBreedBySearchFilter(data).pipe(
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
          this.BreedList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let breed: BreedModel = {
                breedId: list[a].breedId,
                breedRef: list[a].breedRef,
                animalType: list[a].animalType,
                businessUnit: list[a].businessUnit,
                animalTypeId: list[a].animalTypeId,
                name: list[a].name,
                origin: list[a].origin,
                note: list[a].note,
                businessUnitId: list[a].businessUnitId,
              };
              this.BreedList.push(breed);
            }
          }
          this.dataSource = new MatTableDataSource(this.BreedList);
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
  addBreed() {
    this.addLoading = true;
    this.dairyFarmService.addBreed(this.addBreedModel.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getBreedList();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Breed added successfully',
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
  onSave() {
    if (this.addBreedModel.valid && !this.addLoading) {
      this.addBreed();
    }
  }
  initForm() {
    this.addBreedModel = this.formBuilder.group({
      animalTypeId: [0, [Validators.required]],
      name: [null, [Validators.required]],
      origin: [null, [Validators.required]],
      note: [null, [Validators.required]],
      businessUnitId: [null, [Validators.pattern]],
    });
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }
  loadBusinessUnits() {
    this.masterService.getBusinessUnitTypesById(3).subscribe(
      (res) => {
        var dt = res;
        this.BusinessUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.BusinessUnits.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalTypes() {
    this.masterService.getAnimalTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalTypes.push(_data);
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
    this.ngAfterViewInit();
  }
}
