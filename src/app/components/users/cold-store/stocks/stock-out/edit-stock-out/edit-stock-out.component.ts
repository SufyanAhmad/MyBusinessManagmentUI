import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { StockOutModel } from '../../../../../../models/cold-store-model/cold-store-model';
import { AccountService } from '../../../../../../services/account-service/account.service';
import { ColdStoreServiceService } from '../../../../../../services/cold-store-service/cold-store-service.service';

@Component({
  selector: 'app-edit-stock-out',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    RouterLink,
    SelectModule,
    CheckboxModule,
    Skeleton,
  ],
  templateUrl: './edit-stock-out.component.html',
  styleUrl: './edit-stock-out.component.scss',
  providers: [MessageService],
})
export class EditStockOutComponent {
  // isReadOnly: boolean = true;
  // loading: boolean = false;
  // editLoading: boolean = false;
  // stockId: any = null;
  // busUnitId: any = null;
  // businessUnitName: any = null;
  // showConfirmationDialog: boolean = false;

  // stockOutDetail: StockOutModel = {
  //   batchReference: '',
  //   reference: '',
  //   stockId: '',
  //   outQuantity: 0,
  //   stockOutDate: '',
  //   rentRate: 0,
  //   rentMonths: 0,
  //   note: '',
  //   remainingStock: 0,
  //   totalRentRate: 0,
  //   previousOutQuantity: 0,
  //   createdBy: '',
  //   createdAt: '',
  //   updatedBy: '',
  //   updatedAt: '',
  // };

  // constructor(
  //   private route: ActivatedRoute,
  //   private location: Location,
  //   private router: Router,
  //   private messageService: MessageService,
  //   private accountService: AccountService,
  //   private coldStoreService: ColdStoreServiceService
  // ) {}
  // ngOnInit() {
  //   this.stockId = this.route.snapshot.params['id'];
  //   this.busUnitId = localStorage.getItem('BS_businessUnitId');
  //   this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
  //   this.getStocksDetail();
  // }
isReadOnly:boolean=true;
loading:boolean = false;
editLoading:boolean = false;
stockId:any = null;
busUnitId:any = null;
businessUnitName:any = null;
 showConfirmationDialog: boolean = false;

  maxOutQuantity: number = 0;

editStockOutModel!: FormGroup;

  stockOutDetail: StockOutModel = {
      batchReference: '',
      reference: '',
      stockId: '',
      stockOutId: '',
      outQuantity: 0,
      stockOutDate: '',
      rentRate: 0,
      rentMonths: 0,
      note: '',
      remainingStock: 0,
      totalRentRate: 0,
      previousOutQuantity: 0,
      createdBy: '',
      createdAt: '',
      updatedBy: '',
      updatedAt: '',
    }
  constStockOutDetail: StockOutModel = {
      batchReference: '',
      reference: '',
      stockId: '',
      stockOutId: '',
      outQuantity: 0,
      stockOutDate: '',
      rentRate: 0,
      rentMonths: 0,
      note: '',
      remainingStock: 0,
      totalRentRate: 0,
      previousOutQuantity: 0,
      createdBy: '',
      createdAt: '',
      updatedBy: '',
      updatedAt: '',
    }
    
constructor(private route: ActivatedRoute, private location: Location,
private router:Router,private formBuilder: FormBuilder,
private messageService: MessageService,  private accountService:AccountService,
private coldStoreService:ColdStoreServiceService,
){}
ngOnInit() {
   this.stockId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.initForm();
   this.getStocksDetail();
   
}  
initForm() {
 this.editStockOutModel = this.formBuilder.group({
      stockOutId: [this.stockOutDetail.stockOutId],
      outQuantity: [this.stockOutDetail.outQuantity,[
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.min(1),
          Validators.max(this.maxOutQuantity),
        ],],
      stockOutDate: [this.stockOutDetail.stockOutDate, [Validators.required]],
      rentRate: [this.stockOutDetail.rentRate, [Validators.required]],
      note: [this.stockOutDetail.note],
      rentMonths: [this.stockOutDetail.rentMonths],
      remainingStock: [this.stockOutDetail.remainingStock]
         })
       
}

  getStocksDetail() {
    this.loading = true;
    this.coldStoreService.getStockOutDetailById(this.stockId).subscribe(
      (dt) => {
      //   let data = dt;
      //   this.stockOutDetail = {
      //     batchReference: data.batchReference,
      //     reference: data.reference,
      //     stockId: data.stockId,
      //     outQuantity: data.outQuantity,
      //     stockOutDate: data.stockOutDate?.split('T')[0],
      //     rentRate: data.rentRate,
      //     rentMonths: data.rentMonths,
      //     note: data.note,
      //     remainingStock: data.remainingStock,
      //     totalRentRate: data.totalRentRate,
      //     previousOutQuantity: data.previousOutQuantity,
      //     createdBy: data.createdBy,
      //     createdAt: data.createdAt?.split('T')[0],
      //     updatedBy: data.updatedBy,
      //     updatedAt: data.updatedAt?.split('T')[0],
      //   };
      //   this.loading = false;
      // },
        let data=dt;
        if(data.remainingStock==0){
          this.maxOutQuantity = data.outQuantity;
        }
        else{
          this.maxOutQuantity = (data.outQuantity+data.remainingStock);
        }
        this.stockOutDetail = {
            batchReference: data.batchReference,
            reference: data.reference,
            stockId: data.stockId,
            stockOutId: data.stockOutId,
            outQuantity:  data.outQuantity,
            stockOutDate: data.stockOutDate?.split("T")[0],
            rentRate:  data.rentRate,
            rentMonths:  data.rentMonths,
            note: data.note,
            remainingStock:  data.remainingStock,
            totalRentRate:  data.totalRentRate,
            previousOutQuantity:  data.previousOutQuantity,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.split("T")[0],
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt?.split("T")[0],
        }
     this.constStockOutDetail = {
      batchReference: data.batchReference,
            reference: data.reference,
            stockId: data.stockId,
            outQuantity:  data.outQuantity,
            stockOutDate: data.stockOutDate?.split("T")[0],
            rentRate:  data.rentRate,
            rentMonths:  data.rentMonths,
            note: data.note,
            remainingStock:  data.remainingStock,
            totalRentRate:  data.totalRentRate,
            previousOutQuantity:  data.previousOutQuantity,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.split("T")[0],
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt?.split("T")[0],
    }
        this.initForm();
        this.loading=false;
        },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 4000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  discardChanges(){
     this.stockOutDetail = {
    batchReference: this.constStockOutDetail.batchReference,
    reference: this.constStockOutDetail.reference,
    stockId: this.constStockOutDetail.stockId,
    stockOutId: this.constStockOutDetail.stockOutId,
    outQuantity: this.constStockOutDetail.outQuantity,
    stockOutDate: this.constStockOutDetail.stockOutDate?.split("T")[0],
    rentRate: this.constStockOutDetail.rentRate,
    rentMonths: this.constStockOutDetail.rentMonths,
    note: this.constStockOutDetail.note,
    remainingStock: this.constStockOutDetail.remainingStock,
    totalRentRate: this.constStockOutDetail.totalRentRate,
    previousOutQuantity: this.constStockOutDetail.previousOutQuantity,
    createdBy: this.constStockOutDetail.createdBy,
    createdAt: this.constStockOutDetail.createdAt?.split("T")[0],
    updatedBy: this.constStockOutDetail.updatedBy,
    updatedAt: this.constStockOutDetail.updatedAt?.split("T")[0]
};
    this.isReadOnly = true;
    this.initForm();
  }
  editStockOutDetail(){
      this.editLoading = true;
     this.coldStoreService.updateStockOutDetail(this.editStockOutModel.value).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Stock out detail updated successfully', life: 3000 });
       this.goBack();     
       this.editLoading = false;

     },
       (error) => {     
         this.editLoading = false;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life:3000 });
         if (error.status == 401) {
           this.accountService.doLogout();
         }
       })
  }
 goBack() {
    this.location.back();
  }
  deleteStockOutDetail() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteStockOutDetail(this.stockId).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'StockOut detail deleted successfully',
          life: 3000,
        });
        this.router.navigate(['/coldStore/stock-out']);
        // this.getStocksDetail();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
}
