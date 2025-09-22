import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';
import { MilkProductionModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-milk-production',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
  ],
  templateUrl: './edit-milk-production.component.html',
  styleUrl: './edit-milk-production.component.scss',
  providers: [MessageService],
})
export class EditMilkProductionComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  milkProductionId: any = null;
  businessUnitName: any = '';
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalList: masterModal[] = [];

  editMilkProductionModel!: FormGroup;
  MilkProductionDetail: MilkProductionModel = {
    updatedBy: '',
    updatedAt: '',
    milkProductionId: '',
    milkProductionRef: '',
    animalRef: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    animalId: '',
    date: '',
    morning: 0,
    evening: 0,
    total: 0,
    businessUnitId: '',
  };
  constMilkProductionDetail: MilkProductionModel = {
    updatedBy: '',
    updatedAt: '',
    milkProductionId: '',
    milkProductionRef: '',
    animalRef: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    animalId: '',
    date: '',
    morning: 0,
    evening: 0,
    total: 0,
    businessUnitId: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService,
    private coldStoreService: ColdStoreServiceService,
    private dairyFarmService: DairyFarmService
  ) {}
  ngOnInit() {
    this.milkProductionId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');

    this.initForm();
    this.getMilkProductionDetails();
    this.loadAnimal();
  }
  getMilkProductionDetails() {
    this.loading = true;
    this.dairyFarmService
      .GetMilkProductionDetail(this.milkProductionId)
      .subscribe(
        (dt) => {
          let data = dt.data;
          let arrDate = data.date.split('T')[0];
          this.MilkProductionDetail = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            milkProductionId: data.milkProductionId,
            milkProductionRef: data.milkProductionRef,
            animalRef: data.updatedAt,
            businessUnit: data.updatedAt,
            createdBy: data.createdBy,
            createdAt: data.createdAt,
            animalId: data.animalId,
            date: arrDate,
            morning: data.morning,
            evening: data.evening,
            total: data.total,
            businessUnitId: data.businessUnitId,
          };
          this.constMilkProductionDetail = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            milkProductionId: data.milkProductionId,
            milkProductionRef: data.milkProductionRef,
            animalRef: data.updatedAt,
            businessUnit: data.updatedAt,
            createdBy: data.createdBy,
            createdAt: data.createdAt,
            animalId: data.animalId,
            date: arrDate,
            morning: data.morning,
            evening: data.evening,
            total: data.total,
            businessUnitId: data.businessUnitId,
          };
          this.initForm();
          this.loadBusinessUnitTypes();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 4000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
  }
  editLiveStockDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateMilkProductionDetail(
        this.milkProductionId,
        this.editMilkProductionModel.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Milk Production updated successfully',
            life: 3000,
          });
          // this.goBack();
          this.getMilkProductionDetails();
          this.editLoading = false;
          this.isReadOnly = true;
        },
        (error) => {
          this.editLoading = false;
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
  editArchiveStatus() {
    this.coldStoreService
      .updateArchiveStatus(this.milkProductionId, this.isArchived)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update',
            detail: 'Cold store shelf change archived successfully',
            life: 3000,
          });
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

  discardChanges() {
    this.MilkProductionDetail = {
      animalId: this.constMilkProductionDetail.animalId,
      date: this.constMilkProductionDetail.date,
      morning: this.constMilkProductionDetail.morning,
      evening: this.constMilkProductionDetail.evening,
      total: this.constMilkProductionDetail.total,
      businessUnitId: this.constMilkProductionDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editMilkProductionModel = this.formBuilder.group({
      animalId: [this.MilkProductionDetail.animalId, [Validators.required]],
      date: [this.MilkProductionDetail.date, [Validators.required]],
      morning: [this.MilkProductionDetail.morning, [Validators.required]],
      evening: [this.MilkProductionDetail.evening, [Validators.required]],
      total: [this.MilkProductionDetail.total, [Validators.required]],
      businessUnitId: [
        this.MilkProductionDetail.businessUnitId,
        [Validators.required],
      ],
    });
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
  loadAnimal() {
    this.masterService.getAnimal().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].animalId,
            type: dt[a].animalRef,
          };
          this.AnimalList.push(_data);
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
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }
  goBack() {
    this.location.back();
  }
}
