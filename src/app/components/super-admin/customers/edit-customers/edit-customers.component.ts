import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerModel } from '../../../../models/super-admin/super-admin-model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-customers',
  imports: [CommonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './edit-customers.component.html',
  styleUrl: './edit-customers.component.scss',
  providers: [MessageService]

})
export class EditCustomersComponent {
isReadOnly:boolean=true;
isActive:boolean=false;
loading:boolean = false;
editLoading:boolean = false;
customerId:any = null;
phoneValidation = '^03[0-9]{2}-[0-9]{7}$';
emailValidation = '^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\\.[a-zA-Z0-9]{2,}$';
editCustomerModel!: FormGroup;
customerDetail:CustomerModel={
  partyId: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  isActive: false,
  partyTypeId: 0,
  partyType: ''
};
constCustomerDetail:CustomerModel={
  partyId: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  isActive: false,
  partyTypeId: 0,
  partyType: ''
};
constructor(private route: ActivatedRoute, private location: Location,private formBuilder: FormBuilder,private superAdminService:SuperAdminService,private messageService: MessageService,  private accountService:AccountService){}
ngOnInit() {
   this.customerId = this.route.snapshot.params['id'];
   this.initForm();
   this.getCustomerDetails();
   
}  
getCustomerDetails() {
    this.loading = true;
    this.superAdminService.getCustomerSupplierDetail(this.customerId).subscribe(
      (dt) => {
        let data=dt;
        this.customerDetail={
          
          partyId: data.partyId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          isActive: data.isActive,
          partyTypeId: data.partyTypeId,
          partyType: data.partyType
         
        }
         this.constCustomerDetail={
          partyId: data.partyId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          isActive: data.isActive,
          partyTypeId: data.partyTypeId,
          partyType: data.partyType
         
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
     this.superAdminService.updateCustomerSupplierDetail(this.customerId ,this.editCustomerModel.value).subscribe((dt) => {
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
        this.customerDetail={
           partyId: this.constCustomerDetail.partyId,
          name: this.constCustomerDetail.name,
          phone: this.constCustomerDetail.phone,
          email: this.constCustomerDetail.email,
          address: this.constCustomerDetail.address,
          isActive: this.constCustomerDetail.isActive,
          partyTypeId: this.constCustomerDetail.partyTypeId,
          partyType: this.constCustomerDetail.partyType
        }
    this.isReadOnly = true;
    this.initForm();
}
  initForm() {
 this.editCustomerModel = this.formBuilder.group({
              name: [this.customerDetail.name,  [Validators.required]],
              email:[this.customerDetail.email, [Validators.pattern(this.emailValidation)]],
              phone: [this.customerDetail.phone,  [Validators.pattern(this.phoneValidation)]],
              address: [this.customerDetail.address, [Validators.required]],
              partyTypeId:[0]

         })
}
 goBack() {
    this.location.back();
  }
}
