import { CommonModule } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap} from 'rxjs';
import { AccountService } from '../../../../services/account-service/account.service';
import { DataNotFoundComponent } from "../../../data-not-found/data-not-found.component";
import { LoadingComponent } from "../../../loading/loading.component";
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
import { PoultryFarmService } from '../../../../services/poultry-farm-service/poultry-farm.service';
import { feedStockModel, LiveStockModel } from '../../../../models/poultry-farm-model/poultry-farm-model';

@Component({
  selector: 'app-feed-stock',
  imports: [MatPaginatorModule, MatTableModule, MatSortModule, RouterLink, FormsModule, ReactiveFormsModule, DialogModule, CommonModule, CheckboxModule, SelectModule, DataNotFoundComponent, LoadingComponent,ToastModule,ConfirmationPopupComponent],
  templateUrl: './feed-stock.component.html',
  styleUrl: './feed-stock.component.scss',
  providers: [MessageService]
})
export class FeedStockComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey:any=null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  businessUnitTypes:masterModal[]=[];
  visible: boolean = false;
  showConfirmDialog:boolean=false;
   addLoading:boolean= false;
   archived:any=null;
   businessUnitId:any=null;
   coldStoreShelfId:any=null;
   archivedStatus:boolean=false;
  resultsLength: any = 0;
  confirmationMessage:string='';
   businessUnitName:any='';
   addFeedStockModel!: FormGroup;
 displayedColumns: string[] = ['feedType','quantity','unit', 'date','archive'];
 feedStockList:feedStockModel[]=[]
  dataSource!:MatTableDataSource<feedStockModel>;

   
  constructor(private formBuilder: FormBuilder,private masterService:MasterService,
    private coldStoreService:ColdStoreServiceService,private poultryFarmService:PoultryFarmService,
    private messageService: MessageService,
    private accountService:AccountService,private router:Router) { }


 
  ngOnInit() {
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.loadBusinessUnitTypes();
    this.initForm();

  }
initForm() {
 this.addFeedStockModel = this.formBuilder.group({
              businessUnitId: [this.businessUnitId, [Validators.required]],
              feedType: [null,  [Validators.required]],
              unit: [null,  [Validators.required]],
              quantity:[null,[Validators.required,Validators.pattern('^[1-9][0-9]*$'),Validators.min(1)]],
              receivedDate:[null,[Validators.required]],
         })
}

 ngAfterViewInit() {
        setTimeout(() => {
          this.getFeedStockBatchList();
        }, 0);
      }
      getFeedStockBatchList() {
        this.paginator.pageIndex = 0;
        this.paginator.page.observers = [];
        this.feedStockList = [];
        this.dataSource = new MatTableDataSource(this.feedStockList);
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              this.feedStockList = [];
              this.dataSource = new MatTableDataSource(this.feedStockList);
    
              if (this.searchKey == null||this.searchKey=='') {
                this.searchKey = null;
              }
              
              let data={
                searchKey: this.searchKey,
                businessUnitId: this.businessUnitId,
                archived:this.archived,
                pageNumber: this.paginator.pageIndex + 1,
                pageSize: 10
              }
    
              return this.poultryFarmService.GetFeedstockBatchBySearch
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
              let dt=data.list;
              for (let a = 0; a < dt.length; a++) {
            let feedStock: feedStockModel = {
              feedStockId:dt[a].feedStockId,
              feedType:dt[a].feedType,
              quantity:dt[a].quantity,
              unit:dt[a].unit,
              receivedDate:dt[a].receivedDate,
              archived: dt[a].archived,
            };
            this.feedStockList.push(feedStock);
          }
          this.dataSource = new MatTableDataSource(this.feedStockList);
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
         this.getFeedStockBatchList();
      }
    }}

   addFeedStockBatch(){
    this.addLoading = true;
    this.poultryFarmService.AddFeedStockBatch(this.addFeedStockModel.value).subscribe((dt) => {
      this.addLoading = false;
      this.visible=false;
      this.getFeedStockBatchList();
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Feed stock added successfully', life: 3000 });
    
    },
      (error) => {
        this.addLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      })
}
        loadBusinessUnitTypes() {
         this.masterService.getBusinessUnitTypes().subscribe(
           (res) => {
             var dt = res;
             this.businessUnitTypes = [];
             for (let a = 0; a < dt.length; a++) {
               let _data: masterModal = {
                 id: dt[a].businessUnitId,
                 type: dt[a].name,
               };
               this.businessUnitTypes.push(_data);
             }
           },
           (error) => {
             if (error.status == 401) {
               this.accountService.doLogout();
             }
           }
         );
       }
        ResetFilter(){
        this.searchKey=null;
        this.businessUnitId=null;
        this.ngAfterViewInit();
        }
 editArchiveStatus() {
    this.showConfirmDialog = false;
     this.coldStoreService.updateArchiveStatus(this.coldStoreShelfId,this.archivedStatus).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Cold store shelf change archived successfully', life: 3000 });
        this.getFeedStockBatchList();
     },
       (error) => {     
         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life:3000 });
         if (error.status == 401) {
           this.accountService.doLogout();
         }
       })
    
  }
  openConfirmationDialog(isArchive:boolean){
    if(isArchive==true){
      this.archivedStatus=false;
      this.confirmationMessage="Are you sure you want to unarchive this cold store shelf?"
    }
    else{
      this.archivedStatus=true;
      this.confirmationMessage="Are you sure you want to archive this cold store shelf?"

    }
    this.showConfirmDialog=true;
  }

  handleCancelled() {
    this.showConfirmDialog = false;
  }
   preventDecimal(event: KeyboardEvent) {
  if (event.key === '.' || event.key === ',' ) {
    event.preventDefault();
  }
}
}


