import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../services/account-service/account.service';
import { BusinessUnitModel } from '../../../models/super-admin/super-admin-model';
import { masterModal } from '../../../models/master-model/master-model';
import { MasterService } from '../../../services/master-service/master.service';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationPopupComponent } from '../../confirmation-popup/confirmation-popup.component';
import { DataNotFoundComponent } from "../../data-not-found/data-not-found.component";

@Component({
  selector: 'app-business-units',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    CheckboxModule,
    ToastModule,
    SkeletonModule,
    RouterLink,
    ConfirmationPopupComponent,
    DataNotFoundComponent
],
  templateUrl: './business-units.component.html',
  styleUrl: './business-units.component.scss',
  providers: [MessageService],
})
export class BusinessUnitsComponent {
  addLoading: boolean = false;
  editLoading: boolean = false;
  loading: boolean = false;
  detailLoading: boolean = false;
  visible: boolean = false;
  isEditVisible: boolean = false;
  showConfirmDialog: boolean = false;
  isAdminExit: boolean = false;

  businessUnitId: any = null;
  dairyFarmUnitList: BusinessUnitModel[] = [];
  businessTypes: masterModal[] = [];
  addBusinessUnitModel!: FormGroup;
  editBusinessUnitModel!: FormGroup;
  businessUnitDetail: BusinessUnitModel = {
    totalProfit: 0,
    totalSale: 0,
    businessUnitId: '',
    name: '',
    location: '',
    businessTypeId: 0,
    businessTypeName: '',
    totalUser: 0,
    totalEmployee: 0
  };
  type: number = 0;
  userRole:string=''
  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.initForm(1);
    this._initForm();
    if (this.accountService.getRoles().includes("Admin")) {
      this.isAdminExit = true;
    }
    this.userRole = this.accountService.getRoles()
    debugger

    this.getBusinessUnits();

  }
  addBusinessUnit() {
    this.addBusinessUnitModel.get('businessTypeId')?.enable();
    this.addLoading = true;
    this.superAdminService
      .addBusinessUnit(this.addBusinessUnitModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getBusinessUnits();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Business unit added successfully',
            life: 3000,
          });
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  getBusinessUnitDetails() {
    this.detailLoading = true;
    this.superAdminService.getBusinessUnitDetail(this.businessUnitId).subscribe(
      (dt) => {
        let data = dt;
        this.businessUnitDetail = {
          totalProfit: data.totalProfit,
          totalSale: data.totalSale,
          businessUnitId: data.businessUnitId,
          name: data.name,
          location: data.location,
          businessTypeId: data.businessTypeId,
          businessTypeName: data.businessTypeName,
        };
        this._initForm();
        this.detailLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 4000,
        });
        this.accountService.doLogout();
        // if (error.status == 401) {
        // }
      }
    );
  }
  editBusinessDetail() {
    this.editLoading = true;
    this.superAdminService
      .updateBusinessDetail(
        this.businessUnitId,
        this.editBusinessUnitModel.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Business unit updated successfully',
            life: 3000,
          });
          this.editLoading = false;
          this.isEditVisible = false;
          this.getBusinessUnits();
        },
        (error) => {
          this.editLoading = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
  }
  initForm(type: any) {
    this.type = type;
    this.addBusinessUnitModel = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      businessTypeId: [3, [Validators.required]],
    });
  }
  _initForm() {
    this.editBusinessUnitModel = this.formBuilder.group({
      name: [this.businessUnitDetail.name, [Validators.required]],
      location: [this.businessUnitDetail.location, [Validators.required]],
      businessTypeId: [this.businessUnitDetail.businessTypeId, [Validators.required]],
    });
  }
  getBusinessUnits() {
    this.loading = true;
    this.superAdminService.getBusinessUnitsByAdminOrUser(this.userRole).subscribe(
      (dt) => {
        debugger
        this.dairyFarmUnitList=[];
        for (let a = 0; a < dt.length; a++) {
          let busUnit: BusinessUnitModel = {
            totalProfit: dt[a].totalProfit,
            totalSale: dt[a].totalSale,
            businessUnitId: dt[a].businessUnitId,
            name: dt[a].name,
            location: dt[a].location,
            businessTypeId: dt[a].businessTypeId,
            businessTypeName: dt[a].businessTypeName,
            totalUser: dt[a].totalUser,
            totalEmployee: dt[a].totalEmployee,
            totalStockIn: dt[a].totalStockIn,
            totalStockOut: dt[a].totalStockOut,
            totalPendingItems: dt[a].totalPendingItems,
            totalInventoryItems:dt[a].totalInventoryItems,
            totalSales:dt[a].totalSales,
            totalStorageUnitPendingItems:dt[a].totalStorageUnitPendingItems,
            totalAnimalCount:dt[a].totalAnimalCount
          };
        
          if (busUnit.businessTypeId == 3) {
            this.dairyFarmUnitList.push(busUnit);
          }
        }
        this.loading = false;
        this.loadBusinessTypes();
      },
      (error) => {
        this.loading = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBusinessTypes() {
    this.masterService.getBusinessTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.businessTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  setBusinessUnitId(id: any, name: any) {
    localStorage.setItem('DF_businessUnitId', id);
    localStorage.setItem('DF_businessUnit_Name', name);
    localStorage.setItem('DF_businessUnitId',id );
    localStorage.setItem('DF_businessUnit_Name', name);
  }
  deleteBusinessUnit() {
    this.showConfirmDialog = false;
    this.superAdminService.deleteBusinessUnit(this.businessUnitId).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Business unit deleted successfully',
          life: 3000,
        });
        for (let b = 0; b < this.dairyFarmUnitList.length; b++) {
          if (this.dairyFarmUnitList[b].businessUnitId == this.businessUnitId) {
            this.dairyFarmUnitList.splice(b, 1);
          }
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }

  handleCancelled() {
    this.showConfirmDialog = false;
  }
}
