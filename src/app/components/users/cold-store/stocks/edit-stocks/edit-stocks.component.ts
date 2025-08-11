import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { AccountService } from '../../../../../services/account-service/account.service';
import { StockInModel } from '../../../../../models/cold-store-model/cold-store-model';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';
import { Skeleton } from "primeng/skeleton";
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';

@Component({
  selector: 'app-edit-stocks',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastModule, SelectModule, CheckboxModule, Skeleton,RouterLink],
  templateUrl: './edit-stocks.component.html',
  styleUrl: './edit-stocks.component.scss',
  providers: [MessageService]

})
export class EditStocksComponent {
isReadOnly:boolean=true;
loading:boolean = false;
editLoading:boolean = false;
stockId:any = null;
busUnitId:any = null;
businessUnitName:any = null;
  productTypes: masterModal[] = [];
  productUnits: masterModal[] = [];
  types: masterModal[] = [];
  productVarieties: masterModal[] = [];
  partiesTypes: masterModal[] = [];
  racksTypes: masterModal[] = [];
  roomsTypes: masterModal[] = [];
editStockInModel!: FormGroup;

  stockInDetail: StockInModel = {
      stockId: '',
      partyId: '',
      party: '',
      productTypeId: 0,
      productType: '',
      farmerName: '',
      quantity: 0,
      batchReference: '',
      itemName: '',
      coldStoreShelfId: '',
      coldStoreShelf: '',
      coldStoreShelfNo: 0,
      unitId: 0,
      unit: '',
      varietyId: 0,
      variety: '',
      startDate: '',
      note: '',
      voucherId: '',
      voucher: '',
      businessUnitId: '',
      businessUnit: '',
      typeId:'',
      isActive: false,
      roomId:''
    }
  constStockInDetail: StockInModel = {
      stockId: '',
      partyId: '',
      party: '',
      productTypeId: 0,
      productType: '',
      farmerName: '',
      quantity: 0,
      batchReference: '',
      itemName: '',
      coldStoreShelfId: '',
      coldStoreShelf: '',
      coldStoreShelfNo: 0,
      unitId: 0,
      unit: '',
      varietyId: 0,
      variety: '',
      startDate: '',
      note: '',
      voucherId: '',
      voucher: '',
      businessUnitId: '',
      businessUnit: '',
      typeId:'',
      isActive: false,
      roomId:''
    }
    
constructor(private route: ActivatedRoute, private location: Location,private formBuilder: FormBuilder,
private router:Router, private masterService: MasterService,
private messageService: MessageService,  private accountService:AccountService,
private coldStoreService:ColdStoreServiceService,
){}
ngOnInit() {
   this.stockId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.initForm() ;
   this.getStocksDetail();
   this.loadPartiesTypes();
   this.loadProductTypes();

}  
initForm() {
 this.editStockInModel = this.formBuilder.group({
            stockId: [this.stockInDetail.stockId, [Validators.required]],
            partyId: [this.stockInDetail.partyId, [Validators.required]],
            productTypeId: [this.stockInDetail.productTypeId, [Validators.required]],
            farmerName: [this.stockInDetail.farmerName],
            quantity: [this.stockInDetail.quantity, [Validators.required]],
            batchReference: [this.stockInDetail.batchReference],
            typeId: [this.stockInDetail.typeId, [Validators.required]],
            coldStoreShelfId: [this.stockInDetail.coldStoreShelfId, [Validators.required]],
            unitId: [this.stockInDetail.unitId, [Validators.required]],
            varietyId: [this.stockInDetail.varietyId, [Validators.required]],
            startDate: [this.stockInDetail.startDate, [Validators.required]],
            note: [this.stockInDetail.note ],
            businessUnitId: [this.stockInDetail.businessUnitId, [Validators.required]],
            roomId: [this.stockInDetail.roomId, [Validators.required]],
            createdBy: [this.stockInDetail.createdBy],
            createdAt: [this.stockInDetail.createdAt],
            updatedBy: [this.stockInDetail.updatedBy],
            updatedAt: [this.stockInDetail.updatedAt]
         })
         
}

 getStocksDetail() {
    this.loading=true;
    this.coldStoreService.getStockInDetailById(this.stockId).subscribe(
      (dt) => {
        let data=dt;
        this.loadData(data.productTypeId)
        this.stockInDetail = {
          stockId: data.stockId,
          partyId: data.partyId,
          party: data.party,
          productTypeId: data.productTypeId,
          productType: data.productType,
          farmerName: data.farmerName,
          quantity: data.quantity,
          batchReference: data.batchReference,
          itemName: data.itemName,
          coldStoreShelfId: data.coldStoreShelfId,
          coldStoreShelf: data.coldStoreShelf,
          coldStoreShelfNo: data.coldStoreShelfNo,
          unitId: data.unitId,
          unit: data.unit,
          varietyId: data.varietyId,
          variety: data.variety,
          startDate:  data.startDate?.split("T")[0],
          note: data.note,
          voucherId: data.voucherId,
          voucher: data.voucher,
          businessUnitId: data.businessUnitId,
          businessUnit: data.businessUnit,
          isActive: data.isActive,
          typeId:data.typeId,
          type: data.type,
          roomId:data.roomId,
          remainingStock: data.remainingStock,
          totalRentRate: data.totalRentRate,
          reference:data.reference,
          createdBy: data.createdBy,
          createdAt: data.createdAt?.split("T")[0],
          updatedBy: data.updatedBy,
          updatedAt: data.updatedAt?.split("T")[0],

        }
         this.constStockInDetail = {
          stockId: data.stockId,
          partyId: data.partyId,
          party: data.party,
          productTypeId: data.productTypeId,
          productType: data.productType,
          farmerName: data.farmerName,
          quantity: data.quantity,
          batchReference: data.batchReference,
          itemName: data.itemName,
          coldStoreShelfId: data.coldStoreShelfId,
          coldStoreShelf: data.coldStoreShelf,
          coldStoreShelfNo: data.coldStoreShelfNo,
          unitId: data.unitId,
          unit: data.unit,
          varietyId: data.varietyId,
          variety: data.variety,
          startDate:  data.startDate?.split("T")[0],
          note: data.note,
          voucherId: data.voucherId,
          voucher: data.voucher,
          businessUnitId: data.businessUnitId,
          businessUnit: data.businessUnit,
          isActive: data.isActive,
          typeId:data.typeId,
          type: data.type,
          remainingStock: data.remainingStock,
          totalRentRate: data.totalRentRate,
          reference:data.reference,
          createdBy: data.createdBy,
          createdAt: data.createdAt?.split("T")[0],
          updatedBy: data.updatedBy,
          updatedAt: data.updatedAt?.split("T")[0],

        }
        this.initForm();
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
  editStockInDetail(){
    this.editLoading = true;
     this.coldStoreService.updateStockInDetail(this.editStockInModel.value).subscribe((dt) => {
       this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Stock in updated successfully', life: 3000 });
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
    loadData(productTypeId: any) {
    // let productTypeId=this.entryForm.value.productTypeId;
    this.loadTypes(productTypeId);
    this.loadProductVarieties(productTypeId);
    this.loadProductUnits(productTypeId);
  }
  loadPartiesTypes() {
      this.masterService.getPartyTypesById(this.busUnitId).subscribe(
        (res) => {
          var dt = res;
          this.partiesTypes = [];
          for (let a = 0; a < dt.length; a++) {
            let _data: masterModal = {
              id: dt[a].partyId,
              type: dt[a].name,
            };
            this.partiesTypes.push(_data);
          }
          this.loadRacksTypes();
        },
        (error) => {
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
    }
      loadProductTypes() {
    this.masterService.getProductTypes().subscribe(
      (res) => {
        var dt = res;
        this.productTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.productTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadProductUnits(id: any) {
    this.masterService.getProductUnits(id).subscribe(
      (res) => {
        var dt = res;
        this.productUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].unitId,
            type: dt[a].value,
          };
          this.productUnits.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }

  loadProductVarieties(id: any) {
    this.masterService.getVarietiesTypes(id).subscribe(
      (res) => {
        var dt = res;
        this.productVarieties = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].varietyId,
            type: dt[a].value,
          };
          this.productVarieties.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadTypes(id: any) {
    this.masterService.getTypes(id).subscribe(
      (res) => {
        var dt = res;
        this.types = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].typeId,
            type: dt[a].value,
          };
          this.types.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
    loadRacksTypes() {
      this.masterService.getRackTypesById(this.busUnitId).subscribe(
        (res) => {
          var dt = res;
          this.racksTypes = [];
          for (let a = 0; a < dt.length; a++) {
            let _data: masterModal = {
              id: dt[a].coldStoreShelfId,
              type: dt[a].shelfName,
            };
            this.racksTypes.push(_data);
          }
          this.loadRoomsTypes();
        },
        (error) => {
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
    }
    loadRoomsTypes() {
      this.masterService.getRoomTypesById(this.busUnitId).subscribe(
        (res) => {
          var dt = res;
          this.roomsTypes = [];
          for (let a = 0; a < dt.length; a++) {
            let _data: masterModal = {
              id: dt[a].roomId,
              type: dt[a].name,
            };
            this.roomsTypes.push(_data);
          }
        },
        (error) => {
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
    }
    discardChanges() {
      this.stockInDetail= {
      stockId: this.constStockInDetail.stockId,
      partyId: this.constStockInDetail.partyId,
      party: this.constStockInDetail.party,
      productTypeId: this.constStockInDetail.productTypeId,
      productType: this.constStockInDetail.productType,
      farmerName: this.constStockInDetail.farmerName,
      quantity: this.constStockInDetail.quantity,
      batchReference: this.constStockInDetail.batchReference,
      itemName: this.constStockInDetail.itemName,
      coldStoreShelfId: this.constStockInDetail.coldStoreShelfId,
      coldStoreShelf: this.constStockInDetail.coldStoreShelf,
      coldStoreShelfNo: this.constStockInDetail.coldStoreShelfNo,
      unitId: this.constStockInDetail.unitId,
      unit: this.constStockInDetail.unit,
      varietyId: this.constStockInDetail.varietyId,
      variety: this.constStockInDetail.variety,
      startDate: this.constStockInDetail.startDate,
      note: this.constStockInDetail.note,
      voucherId: this.constStockInDetail.voucherId,
      voucher: this.constStockInDetail.voucher,
      businessUnitId: this.constStockInDetail.businessUnitId,
      businessUnit: this.constStockInDetail.businessUnit,
      typeId: this.constStockInDetail.typeId,
      isActive: this.constStockInDetail.isActive
    }
    this.isReadOnly = true;
    this.initForm();
}
 goBack() {
    this.location.back();
  }
}
