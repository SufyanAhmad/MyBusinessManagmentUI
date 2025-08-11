import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router ,RouterLink} from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from "primeng/skeleton";
import { AccountService } from '../../../../../services/account-service/account.service';
import { eggTransferModel} from '../../../../../models/poultry-farm-model/poultry-farm-model';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';

@Component({
  selector: 'app-edit-egg-transfer',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastModule,RouterLink, SelectModule, CheckboxModule, Skeleton],
templateUrl: './edit-egg-transfer.component.html',
  styleUrl: './edit-egg-transfer.component.scss',
  providers: [MessageService]

})
export class EditEggTransferComponent {
isReadOnly:boolean=true;
loading:boolean = false;
editLoading:boolean = false;
eggTransferId:any = null;
busUnitId:any = null;
businessUnitName:any = null;
eggTransferDetail: eggTransferModel = {
  eggTransferId: '',
  ref: '',
  flockId: '',
  flockRef: '',
  dateTransferred: '',
  eggsSent: 0,
  hatcheryName: '',
  businessUnitId: '',
  businessUnit: ''
}
    
constructor(private route: ActivatedRoute, private location: Location,
private router:Router,private poultryFarmService:PoultryFarmService,
private messageService: MessageService,  private accountService:AccountService,

){}
ngOnInit() {
   this.eggTransferId  = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
   this.getEggTransferDetail();
}  

 getEggTransferDetail() {
    this.loading=true;
    this.poultryFarmService.getEggTransferById(this.eggTransferId).subscribe(
      (dt) => {
        let data=dt.data;
        this.eggTransferDetail = {
              eggTransferId: data.eggTransferId,
              ref: data.ref,
              flockId: data.flockId,
              flockRef: data.flockRef,
              dateTransferred: data.dateTransferred?.split("T")[0],
              eggsSent: data.eggsSent,
              hatcheryName: data.hatcheryName,
              businessUnitId: data.businessUnitId,
              businessUnit: data.businessUnit
        }
        this.loading=false;
        },
      (error) => {
        this.loading=false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 4000 });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');

        }
      }
    );
  }
 goBack() {
    this.location.back();
  }
}
