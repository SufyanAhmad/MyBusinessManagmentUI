import { CommonModule } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink} from '@angular/router';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap} from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomerModel } from '../../../../models/super-admin/super-admin-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../../services/master-service/master.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { VoucherTypeModal } from '../../../../models/master-model/master-model';

@Component({
  selector: 'app-vouchers',
  imports: [MatPaginatorModule,MatSortModule,ReactiveFormsModule,RouterLink, MatTableModule, FormsModule, ReactiveFormsModule, DialogModule, CommonModule, CheckboxModule, SelectModule, LoadingComponent, DataNotFoundComponent,ToastModule],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss',
  providers: [MessageService]
})
export class VouchersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  voucherTypeList: VoucherTypeModal[] = [];
  dataSource!: MatTableDataSource<VoucherTypeModal>;
  isRateLimitReached = false;
  isLoadingResults: any = false
  resultsLength: any = 0;
  searchKey:any=null;
  partyTypeId:any=0;
  isActive:any=null;
  status:string='Active';
  visible: boolean = false;
   addLoading:boolean= false;
   resetUerId:any=null;
   addCustomerModel!: FormGroup;
   businessTypes=[
    {
      type:'coldStore',
      id:1
    },
    {
      type:'poultryForm',
      id:2
    },
    {
      type:'StorageUnit',
      id:3
    },
   ]
 displayedColumns: string[] = ['vName','VType',  'vStatus','vDes'];
    businessUnitName:any='';
  constructor(private formBuilder: FormBuilder,private superAdminService:SuperAdminService,
    private masterService:MasterService,private messageService: MessageService,
    private accountService:AccountService,private router:Router) { 
       this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    }
 
  ngOnInit() {
    this.initForm();
  }
   ngAfterViewInit() {
      setTimeout(() => {
        this.getvoucherTypeList();
      }, 0);
    }
    getvoucherTypeList() {
      this.paginator.pageIndex = 0;
      this.paginator.page.observers = [];
      this.voucherTypeList = [];
      this.dataSource = new MatTableDataSource(this.voucherTypeList);
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
      merge(this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            this.voucherTypeList = [];
            this.dataSource = new MatTableDataSource(this.voucherTypeList);
  
            if (this.searchKey == null) {
              this.searchKey = null;
            }
            let data={
              searchKey: this.searchKey,
              partyTypeId: this.partyTypeId,
              isActive: this.isActive,
              pageNumber:  this.paginator.pageIndex + 1,
              pageSize: 10
            }
  
            return this.superAdminService.getVoucherTypes
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
            this.voucherTypeList = [];
            for (let a = 0; a < data.length; a++) {
              let voucher: VoucherTypeModal = {
                voucherTypeId : data[a].voucherTypeId,
                name: data[a].name,
                code: data[a].code,
                description: data[a].description,
                isActive: data[a].isActive
            
              };
              this.voucherTypeList.push(voucher);
            }
            this.dataSource = new MatTableDataSource(this.voucherTypeList);
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
    addCustomer(){
    this.addLoading = true;
    this.superAdminService.addCustomerSupplier(this.addCustomerModel.value).subscribe((dt) => {
      this.addLoading = false;
      this.visible=false;
      this.getvoucherTypeList();
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Customer added successfully', life: 3000 });
    
    },
      (error) => {
        this.addLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 3000 });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      })
}
editCustomerStatus(customerId:any,status:any){
    this.superAdminService.updateCustomerSupplierStatus(customerId,status).subscribe((dt) => {
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Customer status update successfully', life: 3000 });
      // this.getSuppliers();
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
 initForm() {
//  this.addCustomerModel = this.formBuilder.group({
//               name: [null,  [Validators.required]],
//               email:[null],
//               phone: [null, [Validators.required]],
//               address: [null, [Validators.required]],
//               partyTypeId:[0]

//          })
}
    SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getvoucherTypeList();
       
      }
    }}
    ResetFilter(){
  this.searchKey=null;
  this.ngAfterViewInit();
  }
}

