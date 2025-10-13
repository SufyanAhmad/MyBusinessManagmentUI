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
import { FeedModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../services/dairy-farm.service';

@Component({
  selector: 'app-feed',
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
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  providers: [MessageService],
})
export class FeedComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<FeedModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey: any = null;
  stockId: any = null;
  busUnitId: any = null;
  feedList: FeedModel[] = [];
  FeedTypes: masterModal[] = [];
  businessUnitId: any = null;
  key: any = null;
  businessUnitName: any = '';
  // for add feed popup
  addLoading: boolean = false;
  visible: boolean = false;
  addFeedForm!: FormGroup;
  displayedColumns: string[] = [
    'cell1',
    'cell2',
    'cell3',
    'cell4',
    'cell5',
    'cell6',
  ];
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
      this.getFeedList();
    }, 0);
    this.loadFeedTypes();
  }
  getFeedList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.feedList = [];
    this.dataSource = new MatTableDataSource(this.feedList);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.feedList = [];
          this.dataSource = new MatTableDataSource(this.feedList);

          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.dairyFarmService.getFeedBySearchFilter(data).pipe(
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
          this.feedList = [];
          if (list && list.length > 0) {
            debugger;
            this.dataSource.data = list;
            for (let a = 0; a < list.length; a++) {
              let feed: FeedModel = {
                feedId: list[a].feedId,
                businessUnit: list[a].businessUnit,
                feedType: list[a].feedType,
                name: list[a].name,
                businessUnitId: list[a].businessUnitId,
                quantity: list[a].quantity,
                date: list[a].date,
                expiryDate: list[a].expiryDate,
                note: list[a].note,
                feedTypeId: list[a].feedTypeId,
              };
              this.feedList.push(feed);
            }
          }
          this.dataSource = new MatTableDataSource(this.feedList);
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
    this.dairyFarmService.addFeed(this.addFeedForm.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getFeedList();
        this.addFeedForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Feed added successfully',
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
    this.addFeedForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      businessUnitId: [this.busUnitId],
      quantity: [, [Validators.required, Validators.pattern('^[0-9]*$')]],
      date: [null, [Validators.required]],
      expiryDate: [null],
      feedTypeId: [null, [Validators.required]],
      note: [null],
    });
  }
  onDialogHide() {
    this.addFeedForm.reset();
  }
  loadFeedTypes() {
    this.masterService.getFeedTypes().subscribe(
      (res) => {
        let dt = res;
        this.FeedTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedTypeId,
            type: dt[a].feedType,
          };
          this.FeedTypes.push(_data);
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
