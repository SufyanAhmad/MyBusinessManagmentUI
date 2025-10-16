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
import { LoadingComponent } from '../../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../../data-not-found/data-not-found.component';
import {
  FeedConsumptionModel,
  FeedModel,
} from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { masterModal } from '../../../../../models/master-model/master-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-feed-consumption',
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
  templateUrl: './feed-consumption.component.html',
  styleUrl: './feed-consumption.component.scss',
  providers: [MessageService],
})
export class FeedConsumptionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<FeedConsumptionModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  feedConsumptionList: FeedConsumptionModel[] = [];
  FeedTypes: masterModal[] = [];
  AnimalList: masterModal[] = [];
  FeedsList: masterModal[] = [];
  FeedTrackTypesList: masterModal[] = [];
  businessUnitId: any = null;
  key: any = null;
  businessUnitName: any = '';
  isGiven: boolean = true;
  now = new Date();
  dateTimeLocal = this.now.toISOString().slice(0, 16);
  feedTrackTypeId: any = null;
  // for add feed popup
  addLoading: boolean = false;
  visible: boolean = false;
  addFeedConsumptionForm!: FormGroup;
  displayedColumns: string[] = ['cell1', 'cell2', 'cell3', 'cell4', 'cell5'];
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
      this.getFeedConsumptionList();
    }, 0);
    this.loadAnimal();
  }
  getFeedConsumptionList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.feedConsumptionList = [];
    this.dataSource = new MatTableDataSource(this.feedConsumptionList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.feedConsumptionList = [];
          this.dataSource = new MatTableDataSource(this.feedConsumptionList);

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService
            .getFeedConsumptionBySearchFilter(data)
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
          this.feedConsumptionList = [];
          if (list && list.length > 0) {
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: FeedConsumptionModel = {
                feedTrackId: list[a].feedTrackId,
                feedTrackType: list[a].feedTrackType,
                dateTime: list[a].dateTime,
                quantity: list[a].quantity,
                isGiven: list[a].isGiven,
                animalId: list[a].animalId,
                feedId: list[a].feedId,
                feedTrackTypeId: list[a].feedTrackTypeId,
                note: list[a].note,
              };
              this.feedConsumptionList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(this.feedConsumptionList);
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
  addFeed() {
    this.addLoading = true;
    this.dairyFarmService
      .addFeedConsumption(this.addFeedConsumptionForm.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getFeedConsumptionList();
          this.addFeedConsumptionForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Feed consumption added successfully',
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
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }
  initForm() {
    this.addFeedConsumptionForm = this.formBuilder.group({
      dateTime: [this.dateTimeLocal, [Validators.required]],
      quantity: [, [Validators.required]],
      isGiven: [true, [Validators.required]],
      animalId: [null, [Validators.required]],
      feedId: ['', [Validators.required]],
      feedTrackTypeId: [1, [Validators.required]],
      note: [null],
    });
  }
  onDialogHide() {
    this.addFeedConsumptionForm.reset({
      dateTime: this.dateTimeLocal,
      isGiven: true,
      feedTrackTypeId: 1,
    });
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
        this.loadFeeds();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadFeeds() {
    this.masterService.getFeeds().subscribe(
      (res) => {
        let dt = res.data;
        this.FeedsList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedId,
            type: dt[a].name,
          };
          this.FeedsList.push(_data);
        }
        this.loadFeedTrackTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadFeedTrackTypes() {
    this.masterService.getFeedTrackTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.FeedTrackTypesList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedTrackTypeId,
            type: dt[a].name,
          };
          this.FeedTrackTypesList.push(_data);
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
    this.feedTrackTypeId = null;
  }
}
