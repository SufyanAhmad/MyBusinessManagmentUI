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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
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
    RouterLink,
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
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalList: masterModal[] = [];

  editMilkProductionForm!: FormGroup;
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
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService,
    private dairyFarmService: DairyFarmService
  ) {}
  ngOnInit() {
    this.milkProductionId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();

    this.initForm();
    this.getMilkProductionDetails();
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
            animalRef: data.animalRef,
            businessUnit: data.businessUnit,
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
          this.loadAnimal();
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
  editMilkProduction() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateMilkProductionDetail(
        this.milkProductionId,
        this.editMilkProductionForm.value
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
    this.editMilkProductionForm = this.formBuilder.group({
      animalId: [this.MilkProductionDetail.animalId, [Validators.required]],
      date: [this.MilkProductionDetail.date, [Validators.required]],
      morning: [this.MilkProductionDetail.morning, [Validators.required]],
      evening: [this.MilkProductionDetail.evening, [Validators.required]],
      total: [this.MilkProductionDetail.total, [Validators.required]],
      // isActive: [this.MilkProductionDetail.isActive, [Validators.required]],
      businessUnitId: [this.busUnitId],
    });
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

  goBack() {
    this.location.back();
  }
}
