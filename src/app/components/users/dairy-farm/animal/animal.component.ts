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
import { AnimalModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-animal',
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
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.scss',
  providers: [MessageService],
})
export class AnimalComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<AnimalModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  animalId: any = null;
  busUnitId: any = null;
  isActive: boolean = true;
  isFemale: boolean = true;
  animalList: AnimalModel[] = [];
  AnimalTypes: masterModal[] = [];
  AnimalColor: masterModal[] = [];
  AnimalStatus: masterModal[] = [];
  AnimalSourceTypes: masterModal[] = [];
  BirthType: masterModal[] = [];
  Breeds: masterModal[] = [];
  businessUnitId: any = null;
  key: any = null;
  breedId: any = null;
  animalStatusId: any = null;
  businessUnitName: any = '';
  activeTab = 1;
  animalSourceTypeId: any = null;
  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addAnimalForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  displayedColumns: string[] = [
    'animalId',
    'earTag',
    'breedId',
    'purDate',
    'price',
    'status',
    'note',
  ];
  constructor(
    private dairyFarmService: DairyFarmService,
    private masterService: MasterService,
    private accountService: AccountService,
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
      this.getAnimalList();
    }, 0);
  }
  getAnimalList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.animalList = [];
    this.dataSource = new MatTableDataSource(this.animalList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.animalList = [];
          this.dataSource = new MatTableDataSource(this.animalList);
          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            animalSourceTypeId: this.animalSourceTypeId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getAnimalBySearchFilter(data).pipe(
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
          this.animalList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let animal: AnimalModel = {
                animalId: list[a].animalId,
                createdBy: list[a].createdBy,
                createdAt: list[a].createdAt,
                animalRef: list[a].animalRef,
                animalType: list[a].animalType,
                businessUnit: list[a].businessUnit,
                breedType: list[a].breedType,
                animalTypeId: list[a].animalTypeId,
                breedId: list[a].breedId,
                earTag: list[a].earTag,
                age: list[a].age,
                isFemale: list[a].isFemale,
                isActive: list[a].isActive,
                purchaseDate: list[a].purchaseDate,
                price: list[a].price,
                note: list[a].note,
                businessUnitId: list[a].businessUnitId,
                guardian1: list[a].guardian1,
                guardian2: list[a].guardian2,
                placeOfBirth: list[a].placeOfBirth,
                weight: list[a].weight,
                animalStatusId: list[a].animalStatusId,
                animalStatus: list[a].animalStatus,
                animalColor: list[a].animalColor,
                birthType: list[a].birthType,
                animalSourceType: list[a].animalSourceType,
                animalSourceTypeId: list[a].animalSourceTypeId,
                breedTypeId: list[a].breedTypeId,
                birthDate: list[a].birthDate,
                animalColorId: list[a].animalColorId,
                birthTypeId: list[a].birthTypeId,
              };
              this.animalList.push(animal);
            }
          }
          this.dataSource = new MatTableDataSource(this.animalList);
          this.isLoadingResults = false;
          this.loadAnimalTypes();
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

  addAnimal() {
    this.addLoading = true;
    this.dairyFarmService.addAnimal(this.addAnimalForm.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getAnimalList();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Animal added successfully',
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
    if (this.addAnimalForm.valid && !this.addLoading) {
      this.addAnimal();
    }
  }
  initForm() {
    this.addAnimalForm = this.formBuilder.group({
      animalSourceTypeId: [1, [Validators.required]],
      animalTypeId: [0, [Validators.required]],
      breedTypeId: [0, [Validators.required]],
      earTag: [null, [Validators.required]],
      birthDate: [this.today],
      isFemale: [true, [Validators.required]],
      isActive: [true, [Validators.required]],
      purchaseDate: [this.today, [Validators.required]],
      price: [0, [Validators.required]],
      note: [null],
      guardian1: [null],
      guardian2: [null],
      placeOfBirth: [null],
      weight: [null],
      animalStatusId: [0, [Validators.required]],
      businessUnitId: [this.busUnitId],
      animalColorId: [0, [Validators.required]],
      birthTypeId: [0, [Validators.required]],
    });
  }
  onDialogHide() {
    this.addAnimalForm.reset();
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }
  setTab(id: number) {
    this.activeTab = id;
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
        this.loadAnimalColor();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalColor() {
    this.masterService.getAnimalColor().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalColor = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalColor.push(_data);
        }
        this.loadBirthType();
        this.loadAnimalStatus();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBirthType() {
    this.masterService.getBirthTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.BirthType = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.BirthType.push(_data);
        }
        this.loadBreeds();
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
            id: dt[a].key,
            type: dt[a].value,
          };
          this.Breeds.push(_data);
        }
        this.loadAnimalStatus();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalStatus() {
    this.masterService.getAnimalStatus().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalStatus = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalStatus.push(_data);
        }
        this.loadAnimalSourceTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalSourceTypes() {
    this.masterService.getAnimalSourceTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalSourceTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalSourceTypes.push(_data);
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
    this.animalSourceTypeId = null;
    this.ngAfterViewInit();
  }
}
