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
import { DairyFarmModel } from '../../../../models/dairy-farm-model/dairy-farm-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../../services/master-service/master.service';
import { masterModal } from '../../../../models/master-model/master-model';
@Component({
  selector: 'app-dairy-farm-business',
  imports: [
    CommonModule,
    SkeletonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './dairy-farm-business.component.html',
  styleUrl: './dairy-farm-business.component.scss',
  providers: [MessageService],
})
export class DairyFarmBusinessComponent {
  BusinessUnits: masterModal[] = [];
  dairyFarmList: DairyFarmModel[] = [];
  detailLoading: boolean = false;
  businessUnitId: any = null;
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
  // getBusinessUnitDetails() {
  //   this.detailLoading = true;
  //   this.superAdminService.getBusinessUnitDetail(this.businessUnitId).subscribe(
  //     (dt) => {
  //       let data = dt;
  //       this.dairyFarmDetail = {
  //         businessUnitId: data.businessUnitId,
  //         name: data.name,
  //         location: data.location,
  //         businessTypeId: data.businessTypeId,
  //         businessType: data.businessType,
  //       };
  //       // this._initForm();
  //       this.detailLoading = false;
  //     },
  //     (error) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.error.message,
  //         life: 4000,
  //       });
  //       this.accountService.doLogout();
  //       // if (error.status == 401) {
  //       // }
  //     }
  //   );
  // }

  getBusinessUnits() {
    this.loading = true;
    this.superAdminService.getBusinessUnitDetail(this.businessUnitId).subscribe(
      (dt) => {
        this.dairyFarmList = [];
        for (let a = 0; a < dt.length; a++) {
          debugger;
          let busUnit: DairyFarmModel = {
            businessUnitId: dt[a].businessUnitId,
            name: dt[a].name,
            location: dt[a].location,
            businessTypeId: dt[a].businessTypeId,
            businessType: dt[a].businessType,
          };
          // Push into dairyFarmList
          this.dairyFarmList.push(busUnit);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false; // <-- should set false on error too
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
}
