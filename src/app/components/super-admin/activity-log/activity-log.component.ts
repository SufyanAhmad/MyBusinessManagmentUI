import { CommonModule } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ActivityLogModel } from '../../../models/super-admin/super-admin-model';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../services/master-service/master.service';
import { AccountService } from '../../../services/account-service/account.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DataNotFoundComponent } from "../../data-not-found/data-not-found.component";
import { LoadingComponent } from "../../loading/loading.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap} from 'rxjs';


@Component({
  selector: 'app-activity-log',
  imports: [MatPaginatorModule, MatTableModule, FormsModule, ReactiveFormsModule,MatSortModule, DialogModule,ConfirmPopupModule, CommonModule, CheckboxModule, SelectModule, DataNotFoundComponent, LoadingComponent,ConfirmDialogModule,ToastModule,ButtonModule],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  providers: [ConfirmationService, MessageService]

})
export class ActivityLogComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey:any=null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  visible: boolean = false;
  resultsLength: any = 0;
  toDate:any=null;
  fromDate:any=null;

  displayedColumns: string[] = ['name', 'action', 'actionDate','desc'];
  activityLogList: ActivityLogModel[] = [];
  dataSource!: MatTableDataSource<ActivityLogModel>;
  constructor(private superAdminService:SuperAdminService,
    private masterService:MasterService,private confirmationService: ConfirmationService, private messageService: MessageService,
    private accountService:AccountService,private router:Router) { }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
        setTimeout(() => {
          this.getActivityLogList();
        }, 0);
      }
      getActivityLogList() {
        this.paginator.pageIndex = 0;
        this.paginator.page.observers = [];
        this.activityLogList = [];
        this.dataSource = new MatTableDataSource(this.activityLogList);
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              this.activityLogList = [];
              this.dataSource = new MatTableDataSource(this.activityLogList);
    
              if (this.searchKey == null) {
                this.searchKey = null;
              }
              if(this.toDate==''||this.fromDate==''){
                this.toDate=null;
                this.fromDate=null;
              }
              let data={
                searchKey: this.searchKey,
                from: this.fromDate,
                to: this.toDate,
                pageNumber: 1,
                pageSize: 10
              }
    
              return this.superAdminService.getActivityLogs
                (data)
                .pipe(
                  catchError((resp: any) => {
                    if (resp.status == 401) {
                      this.accountService.doLogout();
                      this.router.navigateByUrl('/');
                    }
                    return resp;
                  })
                );
            }),
            map((data) => {
              this.isRateLimitReached = data === null;
              if (data === null) {
                return [];
              }
              this.resultsLength = data.totalCount;
              return data;
            })
          )
          .subscribe(
            (data) => {
              let dt=data
              for (let a = 0; a < dt.length; a++) {
            let activity: ActivityLogModel = {
              id: dt[a].id,
              userId:  dt[a].userId,
              user:  dt[a].user,
              action:  dt[a].action,
              description: dt[a].description,
              actionDate:  dt[a].actionDate
              
            };
            this.activityLogList.push(activity);
          }
          this.dataSource = new MatTableDataSource(this.activityLogList);
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
    SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
         this.getActivityLogList();
       
      }
    }}
    clearAllActivityLog(){
     this.superAdminService.clearAllActivity().subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Clear', detail: 'Clear all activity logs successfully', life: 3000 });
      this.getActivityLogList();
     },
       (error) => {     
         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life:3000 });
         if (error.status == 401) {
           this.accountService.doLogout();
         }
       })
   }
     ResetFilter(){
  this.toDate=null;
  this.fromDate=false;
  this.searchKey=null;
  this.getActivityLogList();
  }
}
