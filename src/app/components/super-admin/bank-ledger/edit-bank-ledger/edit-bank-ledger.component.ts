import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { ActivatedRoute } from '@angular/router';
import { bankLedgerModel } from '../../../../models/super-admin/super-admin-model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-bank-ledger',
  imports: [CommonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './edit-bank-ledger.component.html',
  styleUrl: './edit-bank-ledger.component.scss',
  providers: [MessageService]

})
export class EditBankLedgerComponent {
isReadOnly:boolean=true;
isActive:boolean=false;
loading:boolean = false;
editLoading:boolean = false;
bankLedgerId:any = null;
editBankLedgerModel!: FormGroup;
ledgerDetail:bankLedgerModel={
  bankLedgerId: '',
  createdBy: '',
  createdAt: '',
  accountTitle: '',
  accountNumber: 0,
  bankName: '',
  branchCode: '',
  city: ''
};
constLedgerDetail:bankLedgerModel={
  bankLedgerId: '',
  createdBy: '',
  createdAt: '',
  accountTitle: '',
  accountNumber: 0,
  bankName: '',
  branchCode: '',
  city: ''
};
constructor(private route: ActivatedRoute, private location: Location,private formBuilder: FormBuilder,private superAdminService:SuperAdminService,private messageService: MessageService,  private accountService:AccountService){}
ngOnInit() {
   this.bankLedgerId = this.route.snapshot.params['id'];
   this.initForm();
   this.getBankLedgerDetails();
   
}  
getBankLedgerDetails() {
    this.loading = true;
    this.superAdminService.getBankLedgerDetail(this.bankLedgerId).subscribe(
      (dt) => {
        let data=dt.data;
        this.ledgerDetail={
        bankLedgerId: data.bankLedgerId,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        accountTitle: data.accountTitle,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        branchCode: data.branchCode,
        city: data.city
        }
         this.constLedgerDetail={
          bankLedgerId: data.bankLedgerId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          accountTitle: data.accountTitle,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          branchCode: data.branchCode,
          city: data.city
        }
        this.initForm();
        this.loading = false;
        },
      (error) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 4000 });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
   editCustomerDetail(){
    this.editLoading = true;
     this.superAdminService.updateCustomerSupplierDetail(this.bankLedgerId ,this.editBankLedgerModel.value).subscribe((dt) => {
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
        this.ledgerDetail={
        bankLedgerId: this.constLedgerDetail.bankLedgerId,
        createdBy: this.constLedgerDetail.createdBy,
        createdAt: this.constLedgerDetail.createdAt,
        accountTitle: this.constLedgerDetail.accountTitle,
        accountNumber: this.constLedgerDetail.accountNumber,
        bankName: this.constLedgerDetail.bankName,
        branchCode: this.constLedgerDetail.branchCode,
        city: this.constLedgerDetail.city
        }
    this.isReadOnly = true;
    this.initForm();
}
  initForm() {
 this.editBankLedgerModel = this.formBuilder.group({
              accountTitle: [this.ledgerDetail.accountTitle,  [Validators.required]],
              accountNumber:[this.ledgerDetail.accountNumber],
              bankName: [this.ledgerDetail.bankName, [Validators.required]],
              branchCode: [this.ledgerDetail.branchCode, [Validators.required]],
              city:[this.ledgerDetail.city]

         })
}
 goBack() {
    this.location.back();
  }
}
