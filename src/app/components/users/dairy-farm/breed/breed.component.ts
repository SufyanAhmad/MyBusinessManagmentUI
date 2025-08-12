import { CommonModule } from '@angular/common';
import {Component, ViewChild } from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, merge, startWith, switchMap ,tap} from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { StockOutModel } from '../../../../models/cold-store-model/cold-store-model';
import { masterModal } from '../../../../models/master-model/master-model';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';

@Component({
  selector: 'app-breed',
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, FormsModule, ReactiveFormsModule, DialogModule, CommonModule, SelectModule,SkeletonModule, ToastModule, LoadingComponent, DataNotFoundComponent,RouterLink],
  templateUrl: './breed.component.html',
  styleUrl: './breed.component.scss',
  providers: [MessageService]
})
export class BreedComponent {
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<StockOutModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  loading: boolean = false;
  resultsLength: any = 0;
  searchKey:any=null;
  stockId:any=null;
  busUnitId:any=null;
  stockOutList:StockOutModel[]=[];
  BusinessUnits: masterModal[] = [];
  businessUnitId:any=null;
   businessUnitName:any='';
  bgColor:string='#FFCE3A';
  // for add animal popup
  addLoading: boolean = false;
  visible:boolean=false;
  addAnimalModel!: FormGroup;
 displayedColumns: string[] = [ 'breedId','type','breedName','origin','note'];
  constructor(private route: ActivatedRoute,private coldStoreService:ColdStoreServiceService,private masterService:MasterService,
    private accountService:AccountService,private router:Router) {
   
     }
  ngOnInit() {
  
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.loadBusinessUnits();
  }
   ngAfterViewInit() {
    setTimeout(() => {
      this.getStocksOutList();
    }, 0);
  }
  getStocksOutList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.stockOutList = [];
    this.dataSource = new MatTableDataSource(this.stockOutList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.stockOutList = [];
          this.dataSource = new MatTableDataSource(this.stockOutList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          if (this.stockId == undefined) {
            this.stockId  = null;
          }
          
          let data={
            searchKey: this.searchKey,
            businessUnitId: this.busUnitId,
            isActive:true,
            from: null,
            to: null,
            stockId: this.stockId,
            pageNumber:  this.paginator.pageIndex + 1,
            pageSize: 10
          }

          return this.coldStoreService.getStockOutBySearchFilter
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
          this.stockOutList = [];
          for (let a = 0; a < data.list.length; a++) {
            let stockOut: StockOutModel = {
            batchReference:data.list[a].batchReference,
            reference:data.list[a].reference,
            stockOutId: data.list[a].stockOutId,
            stockId: data.list[a].stockId,
            outQuantity: data.list[a].outQuantity,
            stockOutDate: data.list[a].stockOutDate,
            rentMonths : data.list[a].rentMonths,
            totalDays: data.list[a].totalDays,
            clientId: data.list[a].clientId,
            client: data.list[a].client,
            stockInDate: data.list[a].stockInDate,
            rentRate: data.list[a].rentRate,
            note:data.list[a].note,
            remainingStock:data.list[a].remainingStock,
            totalRentRate: data.list[a].totalRentRate,
           
          };
          this.stockOutList.push(stockOut);
          }
          this.dataSource = new MatTableDataSource(this.stockOutList);
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
  addAnimal(){

  }
    SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
       
      }
    }}

   loadBusinessUnits() {
    this.masterService.getBusinessUnitTypes().subscribe(
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
  ResetFilter(){
  this.searchKey=null;
  this.ngAfterViewInit();
  }


}
