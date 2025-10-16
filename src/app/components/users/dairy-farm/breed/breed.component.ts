import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
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
  dataSource!: MatTableDataSource<masterModal>;
  BreedList: masterModal[] = []; // full list from API
  pagedBreedList: masterModal[] = [];
  isLoadingResults = true;
  pageSize = 10;
  pageIndex = 0;
  businessUnitId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  searchKey: any = null;
  loading: boolean = false;

  // isRateLimitReached = false;
  // isLoadingResults: any = false;
  // resultsLength: any = 0;
  // stockId: any = null;
  // BreedList: BreedModel[] = [];
  // Breeds: masterModal[] = [];
  // key: any = null;

  // for add animal popup
  addLoading: boolean = false;
  visible: boolean = false;
  addBreedForm!: FormGroup;
  displayedColumns: string[] = ['breedName'];
  constructor(
    private masterService: MasterService,
    private accountService: AccountService // private dairyFarmService: DairyFarmService, // private messageService: MessageService,
  ) // private formBuilder: FormBuilder,
  // private router: Router
  {}

  ngOnInit() {
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    // this.initForm();
    this.getBreedList();
  }
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.getBreedList();
  //   }, 0);
  // }
  // getBreedList() {
  //   this.paginator.pageIndex = 0;
  //   this.paginator.page.observers = [];
  //   this.BreedList = [];
  //   this.dataSource = new MatTableDataSource(this.BreedList);

  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

  //   merge(this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         this.BreedList = [];
  //         this.dataSource = new MatTableDataSource(this.BreedList);

  //         let data = {
  //           searchKey: this.searchKey ?? null,
  //           businessUnitId: this.busUnitId,
  //           pageNumber: this.paginator.pageIndex + 1,
  //           pageSize: 10,
  //         };

  //         return this.dairyFarmService.getBreedBySearchFilter(data).pipe(
  //           catchError((resp: any) => {
  //             if (resp.status == 401) {
  //               this.accountService.doLogout();
  //               this.router.navigateByUrl('/');
  //             }
  //             return of({ data: { totalCount: 0, list: [] } });
  //           })
  //         );
  //       }),
  //       map((resp: any) => {
  //         if (!resp || !resp.data) {
  //           return [];
  //         }
  //         this.resultsLength = resp.data.totalCount;
  //         return resp.data.list;
  //       })
  //     )
  //     .subscribe(
  //       (list) => {
  //         this.BreedList = [];
  //         if (list && list.length > 0) {
  //           this.dataSource.data = list;
  //           for (let a = 0; a < list.length; a++) {
  //             let breed: BreedModel = {
  //               breedId: list[a].breedId,
  //               breedRef: list[a].breedRef,
  //               animalType: list[a].animalType,
  //               businessUnit: list[a].businessUnit,
  //               animalTypeId: list[a].animalTypeId,
  //               name: list[a].name,
  //               origin: list[a].origin,
  //               note: list[a].note,
  //               country: list[a].country,
  //               businessUnitId: list[a].businessUnitId,
  //             };
  //             this.BreedList.push(breed);
  //           }
  //         }
  //         this.dataSource = new MatTableDataSource(this.BreedList);
  //         this.isLoadingResults = false;
  //       },
  //       (error) => {
  //         this.isLoadingResults = false;
  //         if (error.status == 401) {
  //           this.accountService.doLogout();
  //           this.router.navigateByUrl('/');
  //         }
  //       }
  //     );
  // }
  // addBreed() {
  //   this.addLoading = true;
  //   this.dairyFarmService.addBreed(this.addBreedForm.value).subscribe(
  //     (dt) => {
  //       this.addLoading = false;
  //       this.visible = false;
  //       this.getBreedList();
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Added',
  //         detail: 'Breed added successfully',
  //         life: 3000,
  //       });
  //     },
  //     (error) => {
  //       this.addLoading = false;
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.error.message,
  //         life: 3000,
  //       });
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //         this.router.navigateByUrl('/');
  //       }
  //     }
  //   );
  // }
  // onSave() {
  //   if (this.addBreedForm.valid && !this.addLoading) {
  //     this.addBreed();
  //   }
  // }
  // initForm() {
  //   this.addBreedForm = this.formBuilder.group({
  //     animalTypeId: [0, [Validators.required]],
  //     name: [null, [Validators.required]],
  //     origin: [null],
  //     note: [null],
  //     country: [null],
  //     businessUnitId: [this.busUnitId],
  //   });
  // }
  // onDialogHide() {
  //   this.addBreedForm.reset();
  // }
  // getBreedList() {
  //   this.masterService.getBreeds().subscribe(
  //     (res) => {
  //       const dt = res.data;
  //       const breeds: masterModal[] = dt.map((item: any) => ({
  //         id: item.key,
  //         type: item.value,
  //       }));
  //       this.dataSource = new MatTableDataSource(breeds);
  //       this.dataSource.paginator = this.paginator; // 👈 attach paginator
  //       this.dataSource.sort = this.sort;
  //     },
  //     (error) => {
  //       if (error.status === 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
  getBreedList() {
    this.isLoadingResults = true;
    this.masterService.getBreeds().subscribe(
      (res) => {
        const dt = res.data;
        this.BreedList = dt.map((item: any) => ({
          id: item.key,
          type: item.value,
        }));
        this.updatePagedData();
        this.isLoadingResults = false;
      },
      (error) => {
        console.error(error);
        this.isLoadingResults = false;
      }
    );
  }
  // Update paged data when paginator changes
  updatePagedData(event?: PageEvent) {
    this.loading = true;
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBreedList = this.BreedList.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource(this.pagedBreedList);
    this.loading = false;
  }

  // archBySearchKey(event: any) {
  //   if (event.key != 'Enter') {
  //     if (this.searchKey == '' || this.searchKey == null) {
  //       this.searchKey = null;
  //     }
  //   }
  // }
  // SearchBySearchKey(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   // implement your search logic here
  //   console.log('Searching:', value);
  // }

  // ResetFilter() {
  //   this.searchKey = null;
  //   this.businessUnitId = null;
  //   // this.ngAfterViewInit();
  // }
}
