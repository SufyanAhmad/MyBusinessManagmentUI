import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { DairyFarmService } from './../../../../services/dairy-farm.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { Router } from '@angular/router';
import {
  BusinessUnitModel,
  DairyFarmModel,
} from '../../../../models/dairy-farm-model/dairy-farm-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { masterModal } from '../../../../models/master-model/master-model';
import { ToastModule } from 'primeng/toast';
import { MasterService } from '../../../../services/master-service/master.service';
@Component({
  selector: 'app-dairy-farm-business',
  imports: [
    CommonModule,
    SkeletonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './dairy-farm-business.component.html',
  styleUrl: './dairy-farm-business.component.scss',
  providers: [MessageService],
})
export class DairyFarmBusinessComponent {
  BusinessUnits: masterModal[] = [];
  dairyFarmList: BusinessUnitModel[] = [];
  detailLoading: boolean = false;
  businessUnitId: any = null;
  businessTypes: masterModal[] = [];
  dairyFarmDetail: DairyFarmModel = {
    businessUnitId: '',
    name: '',
    location: '',
    businessTypeId: 0,
    businessType: '',
  };

  loading: boolean = false;
  addLoading: boolean = false;
  visible: boolean = false;
  addDairyFarmBusinessModel!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private router: Router
  ) {}
  ngOnInit() {
    this.initForm();
    this.getBusinessUnits();
    // this.getBusinessUnitDetails();
  }
  initForm() {
    this.addDairyFarmBusinessModel = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      businessTypeId: [3, [Validators.required]],
    });
  }
  addDairyFarmBusinessUnit() {
    this.addLoading = true;
    this.dairyFarmService
      .addBusinessUnit(this.addDairyFarmBusinessModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          // this.getBusinessUnits();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Dairy farm business unit added successfully',
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
  // getBusinessUnits() {
  //   this.loading = true;
  //   this.superAdminService.getBusinessUnits().subscribe(
  //     (dt) => {
  //       this.dairyFarmList = [];
  //       // this.poultryFarmUnitList = [];
  //       // this.storageUnitList = [];
  //       for (let a = 0; a < dt.length; a++) {
  //         let busUnit: BusinessUnitModel = {
  //           totalProfit: dt[a].totalProfit,
  //           totalSale: dt[a].totalSale,
  //           businessUnitId: dt[a].businessUnitId,
  //           name: dt[a].name,
  //           location: dt[a].location,
  //           businessTypeId: dt[a].businessTypeId,
  //           businessTypeName: dt[a].businessTypeName,
  //           totalUser: dt[a].totalUser,
  //           totalEmployee: dt[a].totalEmployee,
  //           totalStockIn: dt[a].totalStockIn,
  //           totalStockOut: dt[a].totalStockOut,
  //           totalPendingItems: dt[a].totalPendingItems,
  //           totalInventoryItems: dt[a].totalInventoryItems,
  //           totalSales: dt[a].totalSales,
  //           totalStorageUnitPendingItems: dt[a].totalStorageUnitPendingItems,
  //         };
  //         if (busUnit.businessTypeId == 3) {
  //           this.dairyFarmList.push(busUnit);
  //         } else if (busUnit.businessTypeId == 1) {
  //             this.poultryFarmUnitList.push(busUnit);
  //           } else if (busUnit.businessTypeId == 2) {
  //             this.storageUnitList.push(busUnit);
  //         }
  //       }
  //       this.loading = false;
  //       this.loadBusinessTypes();
  //     },
  //     (error) => {
  //       this.loading = true;
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.message,
  //         life: 3000,
  //       });
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
  getBusinessUnits() {
    this.loading = true;
    this.superAdminService.getBusinessUnits().subscribe(
      (dt) => {
        this.dairyFarmList = [];

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
            totalInventoryItems: dt[a].totalInventoryItems,
            totalSales: dt[a].totalSales,
            totalStorageUnitPendingItems: dt[a].totalStorageUnitPendingItems,
          };
          if (busUnit.businessTypeId === 3) {
            this.dairyFarmList.push(busUnit);
          }
        }

        this.loading = false;
        this.loadBusinessTypes();
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status === 401) {
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
}
