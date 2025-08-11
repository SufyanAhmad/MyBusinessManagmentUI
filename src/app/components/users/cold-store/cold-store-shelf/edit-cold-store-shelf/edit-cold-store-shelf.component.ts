import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { SuperAdminService } from '../../../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../../../services/account-service/account.service';
import { ClodStoreShelfModel } from '../../../../../models/cold-store-model/cold-store-model';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';

@Component({
  selector: 'app-edit-cold-store-shelf',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,ToastModule,SelectModule,CheckboxModule,RouterLink],
  templateUrl: './edit-cold-store-shelf.component.html',
  styleUrl: './edit-cold-store-shelf.component.scss',
  providers: [MessageService]

})
export class EditColdStoreShelfComponent {
isReadOnly:boolean=true;
isActive:boolean=false;
loading:boolean = false;
editLoading:boolean = false;
coldStoreShelfId:any = null;
businessUnitName:any='';
isOccupy: boolean = true;
isArchived:boolean=false;
businessUnitTypes:masterModal[]=[];

editColdStoreShelfModel!: FormGroup;
coldStoreShelfDetail:ClodStoreShelfModel={
  coldStoreShelfId: '',
  businessUnitId: '',
  businessUnit: '',
  shelfName: '',
  capacityCubicFeet: 0,
  isOccupied: false
};
constColdStoreShelfDetail:ClodStoreShelfModel={
  coldStoreShelfId: '',
  businessUnitId: '',
  businessUnit: '',
  shelfName: '',
  capacityCubicFeet: 0,
  isOccupied: false
};
constructor(private route: ActivatedRoute, private location: Location,
private formBuilder: FormBuilder,private superAdminService:SuperAdminService,
private messageService: MessageService,  private accountService:AccountService,
private masterService:MasterService,private coldStoreService:ColdStoreServiceService,
){}
ngOnInit() {
   this.coldStoreShelfId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');

   this.initForm();
   this.getColdStoreDetails();
   
}  
getColdStoreDetails() {
    this.loading = true;
    this.coldStoreService.getColdStoreShelfDetail(this.coldStoreShelfId).subscribe(
      (dt) => {
        let data=dt;
        this.isArchived=data.archived;
        this.coldStoreShelfDetail={
            coldStoreShelfId: data.coldStoreShelfId,
            businessUnitId: data.businessUnitId,
            businessUnit: data.businessUnit,
            shelfName: data.shelfName,
            capacityCubicFeet: data.capacityCubicFeet,
            isOccupied: data.isOccupied
          };
         this.constColdStoreShelfDetail={
          coldStoreShelfId: data.coldStoreShelfId,
            businessUnitId: data.businessUnitId,
            businessUnit: data.businessUnit,
            shelfName: data.shelfName,
            capacityCubicFeet: data.capacityCubicFeet,
            isOccupied: data.isOccupied
        }
        this.initForm();
        this.loadBusinessUnitTypes();
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
   editColdStoreShelfDetail(){
    this.editLoading = true;
     this.coldStoreService.updateColdStoreShelfDetail(this.coldStoreShelfId ,this.editColdStoreShelfModel.value).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Cold store shelf updated successfully', life: 3000 });
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
    editArchiveStatus() {
     this.coldStoreService.updateArchiveStatus(this.coldStoreShelfId,this.isArchived).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Cold store shelf change archived successfully', life: 3000 });
        
     },
       (error) => {     
         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life:3000 });
         if (error.status == 401) {
           this.accountService.doLogout();
         }
       })
    
  }
   discardChanges() {
        this.coldStoreShelfDetail={
            coldStoreShelfId: this.constColdStoreShelfDetail.coldStoreShelfId,
            businessUnitId: this.constColdStoreShelfDetail.businessUnitId,
            businessUnit: this.constColdStoreShelfDetail.businessUnit,
            shelfName: this.constColdStoreShelfDetail.shelfName,
            capacityCubicFeet: this.constColdStoreShelfDetail.capacityCubicFeet,
            isOccupied: this.constColdStoreShelfDetail.isOccupied
        }
    this.isReadOnly = true;
    this.initForm();
}
  initForm() {
 this.editColdStoreShelfModel = this.formBuilder.group({
              shelfName: [this.coldStoreShelfDetail.shelfName,  [Validators.required]],
              capacityCubicFeet:[this.coldStoreShelfDetail.capacityCubicFeet,[Validators.required]],
              businessUnitId: [this.coldStoreShelfDetail.businessUnitId, [Validators.required]],
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
 goBack() {
    this.location.back();
  }
}
