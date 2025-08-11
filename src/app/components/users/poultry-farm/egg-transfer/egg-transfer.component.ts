
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
import { PoultryFarmService } from '../../../../services/poultry-farm-service/poultry-farm.service';
import { eggTransferModel } from '../../../../models/poultry-farm-model/poultry-farm-model';

@Component({
  selector: 'app-egg-transfer',
  imports: [MatPaginatorModule, MatTableModule, MatSortModule, RouterLink, FormsModule, ReactiveFormsModule, DialogModule, CommonModule, CheckboxModule, SelectModule, DataNotFoundComponent, LoadingComponent,ToastModule],
  templateUrl: './egg-transfer.component.html',
  styleUrl: './egg-transfer.component.scss',
  providers: [MessageService]
})
export class EggTransferComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey:any=null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  flockRef:masterModal[]=[];
  visible: boolean = false;
  showConfirmDialog:boolean=false;
   addLoading:boolean= false;
   businessUnitId:any=null;
  resultsLength: any = 0;
   businessUnitName:any='';
   addEggTransferModel!: FormGroup;
 displayedColumns: string[] = ['ref','flock', 'date','eggSent','hatchery'];
 eggTransferList:eggTransferModel[]=[]
  dataSource!:MatTableDataSource<eggTransferModel>;

   
  constructor(private formBuilder: FormBuilder,private masterService:MasterService,
    private coldStoreService:ColdStoreServiceService,private poultryFarmService:PoultryFarmService,
    private messageService: MessageService,
    private accountService:AccountService,private router:Router) { }


 
  ngOnInit() {
    this.businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.loadFlockRef();
    this.initForm();

  }
initForm() {
 this.addEggTransferModel = this.formBuilder.group({
              businessUnitId: [this.businessUnitId, [Validators.required]],
              flockId: [null,  [Validators.required]],
              dateTransferred:[new Date().toISOString().substring(0, 10),[Validators.required]],
              eggsSent:[1,[Validators.required,Validators.pattern('^[1-9][0-9]*$'),Validators.min(1)]],
              hatcheryName:[null,[Validators.required]],

         })
}

 ngAfterViewInit() {
        setTimeout(() => {
          this.getEggTransferList();
        }, 0);
      }
      getEggTransferList() {
        this.paginator.pageIndex = 0;
        this.paginator.page.observers = [];
        this.eggTransferList = [];
        this.dataSource = new MatTableDataSource(this.eggTransferList);
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              this.eggTransferList = [];
              this.dataSource = new MatTableDataSource(this.eggTransferList);
    
              if (this.searchKey == null||this.searchKey=='') {
                this.searchKey = null;
              }
              
              let data={
                searchKey: this.searchKey,
                businessUnitId: this.businessUnitId,
                pageNumber: this.paginator.pageIndex + 1,
                pageSize: 10
              }
    
              return this.poultryFarmService.GetEggTransferBySearchFilter
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
              this.resultsLength = data.data.totalCount;
              return data.data;
            })
          )
          .subscribe(
            (data) => {
              let dt=data.list;
              for (let a = 0; a < dt.length; a++) {
            let eggTransfer: eggTransferModel = {
            eggTransferId: dt[a].eggTransferId,
            ref: dt[a].ref,
            flockId: dt[a].flockId,
            flockRef: dt[a].flockRef,
            dateTransferred: dt[a].dateTransferred,
            eggsSent: dt[a].eggsSent,
            hatcheryName: dt[a].hatcheryName,
            businessUnitId: dt[a].businessUnitId,
            businessUnit: dt[a].businessUnit
          };
            this.eggTransferList.push(eggTransfer);
          }
          this.dataSource = new MatTableDataSource(this.eggTransferList);
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
         this.getEggTransferList();
      }
    }}

   addEggTransfer(){
    this.addLoading = true;
    this.poultryFarmService.AddEggTransfer(this.addEggTransferModel.value).subscribe((dt) => {
      this.addLoading = false;
      this.visible=false;
      this.getEggTransferList();
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Egg transfer added successfully', life: 3000 });
    
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
loadFlockRef() {
         this.masterService.getFlockRef(this.businessUnitId).subscribe(
           (res) => {
             var dt = res;
             this.flockRef = [];
             for (let a = 0; a < dt.length; a++) {
               let _data: masterModal = {
                 id: dt[a].flockId,
                 type: dt[a].flockRef,
               };
               this.flockRef.push(_data);
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
        this.ngAfterViewInit();
        }
}

