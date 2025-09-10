import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';
import { LiveStockModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';

@Component({
  selector: 'app-edit-animal',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,ToastModule,SelectModule],
  templateUrl: './edit-animal.component.html',
  styleUrl: './edit-animal.component.scss',
  providers: [MessageService]

})
export class EditAnimalComponent {
isReadOnly:boolean=true;
isActive:boolean=false;
loading:boolean = false;
editLoading:boolean = false;
liveStockId:any = null;
businessUnitName:any='';
isArchived:boolean=false;
businessUnitTypes:masterModal[]=[];

editLiveStockModel!: FormGroup;
liveStockDetail:LiveStockModel={
  livestockBatchId: '',
  breed: '',
  quantity: 0,
  arrivalDate: '',
  ageInDays: 0,
  healthStatus: '',
  businessUnitId:''
};
constLiveStockDetail:LiveStockModel={
 livestockBatchId: '',
  breed: '',
  quantity: 0,
  arrivalDate: '',
  ageInDays: 0,
  healthStatus: '',
  businessUnitId:''
};
constructor(private route: ActivatedRoute, private location: Location,
private formBuilder: FormBuilder,private poultryFarmService:PoultryFarmService,
private messageService: MessageService,  private accountService:AccountService,
private masterService:MasterService,private coldStoreService:ColdStoreServiceService,
){}
ngOnInit() {
   this.liveStockId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');

   this.initForm();
  //  this.getLiveStockDetails();
   
}  
getLiveStockDetails() {
    this.loading = true;
    this.poultryFarmService.GetLiveStockDetail(this.liveStockId).subscribe(
      (dt) => {
        let data=dt;
        this.isArchived=data.archived;
        let arrDate=data.arrivalDate.split("T")[0];
          this.liveStockDetail={
          livestockBatchId: data.livestockBatchId,
          breed: data.breed,
          quantity: data.quantity,
          arrivalDate: arrDate,
          ageInDays: data.ageInDays,
          healthStatus: data.healthStatus,
          businessUnitId: data.businessUnitId,
        };
          this.constLiveStockDetail={
          livestockBatchId: data.livestockBatchId,
          breed: data.breed,
          quantity: data.quantity,
          arrivalDate: arrDate,
          ageInDays: data.ageInDays,
          healthStatus: data.healthStatus,
          businessUnitId: data.businessUnitId,

        };
        this.initForm();
        this.loadBusinessUnitTypes();
        this.loading = false;
        },
      (error) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail:error.message, life: 4000 });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
   editLiveStockDetail(){
    this.editLoading = true;
     this.poultryFarmService.UpdateLiveStockDetail(this.liveStockId ,this.editLiveStockModel.value).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Live stock updated successfully', life: 3000 });
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
     this.coldStoreService.updateArchiveStatus(this.liveStockId,this.isArchived).subscribe((dt) => {
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
        this.liveStockDetail={
            livestockBatchId: this.constLiveStockDetail.livestockBatchId,
             businessUnitId: this.constLiveStockDetail.businessUnitId,
              breed: this.constLiveStockDetail.breed,  
              quantity:this.constLiveStockDetail.quantity,
              arrivalDate:this.constLiveStockDetail.arrivalDate,
              ageInDays:this.constLiveStockDetail.ageInDays,
              healthStatus:this.constLiveStockDetail.healthStatus,
        }
    this.isReadOnly = true;
    this.initForm();
}
  initForm() {
 this.editLiveStockModel = this.formBuilder.group({
              businessUnitId: [this.liveStockDetail.businessUnitId, [Validators.required]],
              breed: [this.liveStockDetail.breed,  [Validators.required]],
              quantity:[this.liveStockDetail.quantity,[Validators.required,Validators.pattern('^[1-9][0-9]*$'),Validators.min(1)]],
              arrivalDate:[this.liveStockDetail.arrivalDate,[Validators.required]],
              ageInDays:[this.liveStockDetail.ageInDays,[Validators.required, Validators.pattern('^[1-9][0-9]*$'),Validators.min(1)]],
              healthStatus:[this.liveStockDetail.healthStatus,[Validators.required]]
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
        preventDecimal(event: KeyboardEvent) {
  if (event.key === '.' || event.key === ',' ) {
    event.preventDefault();
  }
}
 goBack() {
    this.location.back();
  }
}
