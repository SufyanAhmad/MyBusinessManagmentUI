import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { ActivatedRoute } from '@angular/router';
import { bankLedgerModel, expenseModel } from '../../../../models/super-admin/super-admin-model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-expanses',
  imports: [CommonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './edit-expanses.component.html',
  styleUrl: './edit-expanses.component.scss',
  providers: [MessageService]

})
export class EditExpansesComponent {
isReadOnly:boolean=true;
isActive:boolean=false;
loading:boolean = false;
editLoading:boolean = false;
bankLedgerId:any = null;
editExpanseModel!: FormGroup;
expanseDetail:expenseModel={
  updatedBy: '',
  updatedAt: '',
  expenseId: '',
  party: '',
  expenseStatus: '',
  createdBy: '',
  createdAt: '',
  date: '',
  name: '',
  amount: 0,
  paymentMethod: '',
  description: '',
  partyId: '',
  attachment: '',
  expenseStatusId: 0
};
constExpanseDetail:expenseModel={
  updatedBy: '',
  updatedAt: '',
  expenseId: '',
  party: '',
  expenseStatus: '',
  createdBy: '',
  createdAt: '',
  date: '',
  name: '',
  amount: 0,
  paymentMethod: '',
  description: '',
  partyId: '',
  attachment: '',
  expenseStatusId: 0
};
constructor(private route: ActivatedRoute, private location: Location,private formBuilder: FormBuilder,private superAdminService:SuperAdminService,private messageService: MessageService,  private accountService:AccountService){}
ngOnInit() {
   this.bankLedgerId = this.route.snapshot.params['id'];
   this.initForm();
   this.getExpanseDetail();
   
}  
getExpanseDetail() {
    this.loading = true;
    // this.superAdminService.getExpanseDetail(this.bankLedgerId).subscribe(
    //   (dt) => {
    //     let data=dt.data;
    //     this.expanseDetail={
    //     updatedBy: data.updatedBy,
    //     updatedAt: data.updatedAt,
    //     expenseId: data.expenseId,
    //     party: data.party,
    //     expenseStatus: data.expenseStatus,
    //     createdBy: data.createdBy,
    //     createdAt: data.createdAt,
    //     date: data.date.split("T")[0],
    //     name: data.name,
    //     amount: data.amount,
    //     paymentMethod: data.paymentMethod,
    //     description: data.description,
    //     partyId: data.partyId,
    //     attachment: data.attachment,
    //     expenseStatusId: data.expenseStatusId
        
    //     }
    //     this.constExpanseDetail={
    //     updatedBy: data.updatedBy,
    //     updatedAt: data.updatedAt,
    //     expenseId: data.expenseId,
    //     party: data.party,
    //     expenseStatus: data.expenseStatus,
    //     createdBy: data.createdBy,
    //     createdAt: data.createdAt,
    //     date: data.date,
    //     name: data.name,
    //     amount: data.amount,
    //     paymentMethod: data.paymentMethod,
    //     description: data.description,
    //     partyId: data.partyId,
    //     attachment: data.attachment,
    //     expenseStatusId: data.expenseStatusId
    //     }
    //     this.initForm();
    //     this.loading = false;
    //     },
    //   (error) => {
    //     this.loading = false;
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 4000 });
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //     }
    //   }
    // );
  }
   editCustomerDetail(){
    this.editLoading = true;
     this.superAdminService.updateCustomerSupplierDetail(this.bankLedgerId ,this.editExpanseModel.value).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Customer updated successfully', life: 3000 });
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
   discardChanges() {
      this.expanseDetail = {
  updatedBy: this.constExpanseDetail.updatedBy,
  updatedAt: this.constExpanseDetail.updatedAt,
  expenseId: this.constExpanseDetail.expenseId,
  party: this.constExpanseDetail.party,
  expenseStatus: this.constExpanseDetail.expenseStatus,
  createdBy: this.constExpanseDetail.createdBy,
  createdAt: this.constExpanseDetail.createdAt,
  date: this.constExpanseDetail.date,
  name: this.constExpanseDetail.name,
  amount: this.constExpanseDetail.amount,
  paymentMethod: this.constExpanseDetail.paymentMethod,
  description: this.constExpanseDetail.description,
  partyId: this.constExpanseDetail.partyId,
  attachment: this.constExpanseDetail.attachment,
  expenseStatusId: this.constExpanseDetail.expenseStatusId
};

    this.isReadOnly = true;
    this.initForm();
}
  initForm() {
 this.editExpanseModel = this.formBuilder.group({
  date: [this.expanseDetail.date, [Validators.required]],
  name: [this.expanseDetail.name, [Validators.required]],
  amount: [this.expanseDetail.amount, [Validators.required, Validators.min(1)]],
  paymentMethod: [this.expanseDetail.paymentMethod, [Validators.required]],
  description: [this.expanseDetail.description, [Validators.required]],
  partyId: [this.expanseDetail.partyId, [Validators.required]],
  expenseStatusId: [this.expanseDetail.expenseStatusId, [Validators.required]],
});
}
 goBack() {
    this.location.back();
  }
}
