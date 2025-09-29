import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import {
  HealthVaccinationRecordModel,
  PregnancyRecordModel,
} from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-health-record',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-health-record.component.html',
  styleUrl: './edit-health-record.component.scss',
  providers: [MessageService],
})
export class EditHealthRecordComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  healthVaccinationRecordId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  BusinessUnits: masterModal[] = [];
  AnimalList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  businessUnitId: any = null;
  delivered: boolean = true;
  breedId: any = null;

  editHealthVaccinationRecordModel!: FormGroup;

  HealthVaccinationRecordDetail: HealthVaccinationRecordModel = {
    updatedBy: '',
    updatedAt: '',
    healthVaccinationRecordId: '',
    recordRef: '',
    supplierName: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    supplierId: '',
    date: '',
    name: '',
    purpose: '',
    nextDueDate: '',
    businessUnitId: '',
  };
  constHealthVaccinationRecord: HealthVaccinationRecordModel = {
    updatedBy: '',
    updatedAt: '',
    healthVaccinationRecordId: '',
    recordRef: '',
    supplierName: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    supplierId: '',
    date: '',
    name: '',
    purpose: '',
    nextDueDate: '',
    businessUnitId: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.healthVaccinationRecordId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getHealthVaccinationRecordDetails();
    }, 0);
  }
  getHealthVaccinationRecordDetails() {
    this.loading = true;
    this.dairyFarmService
      .GetHealthVaccinationRecordDetail(this.healthVaccinationRecordId)
      .subscribe(
        (dt) => {
          let data = dt.data;
          this.isArchived = data.archived;
          let createdDate = data.createdAt?.split('T')[0];
          let arrDate = data.date?.split('T')[0];
          let nextDueDate = data.nextDueDate?.split('T')[0];
          this.HealthVaccinationRecordDetail = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            healthVaccinationRecordId: data.healthVaccinationRecordId,
            recordRef: data.recordRef,
            supplierName: data.supplierName,
            businessUnit: data.businessUnit,
            createdBy: data.createdBy,
            createdAt: createdDate,
            supplierId: data.supplierId,
            date: arrDate,
            name: data.name,
            purpose: data.purpose,
            nextDueDate: nextDueDate,
            businessUnitId: data.businessUnitId,
          };
          this.constHealthVaccinationRecord = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            healthVaccinationRecordId: data.healthVaccinationRecordId,
            recordRef: data.recordRef,
            supplierName: data.supplierName,
            businessUnit: data.businessUnit,
            createdBy: data.createdBy,
            createdAt: createdDate,
            supplierId: data.supplierId,
            date: data.date,
            name: data.name,
            purpose: data.purpose,
            nextDueDate: data.nextDueDate,
            businessUnitId: data.businessUnitId,
          };
          this.initForm();
          this.loading = false;
          this.loadAnimal();
          this.loadParties();
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
  editHealthVaccinationRecordDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateHealthVaccinationRecordDetail(
        this.healthVaccinationRecordId,
        this.editHealthVaccinationRecordModel.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Health Vaccination Record updated successfully',
            life: 3000,
          });
          this.getHealthVaccinationRecordDetails();
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
    this.HealthVaccinationRecordDetail = {
      supplierId: this.constHealthVaccinationRecord.supplierId,
      date: this.constHealthVaccinationRecord.date,
      name: this.constHealthVaccinationRecord.name,
      purpose: this.constHealthVaccinationRecord.purpose,
      nextDueDate: this.constHealthVaccinationRecord.nextDueDate,
      businessUnitId: this.constHealthVaccinationRecord.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editHealthVaccinationRecordModel = this.formBuilder.group({
      supplierId: [
        this.HealthVaccinationRecordDetail.supplierId,
        [Validators.required],
      ],
      date: [this.HealthVaccinationRecordDetail.date, [Validators.required]],
      name: [this.HealthVaccinationRecordDetail.name, [Validators.required]],
      purpose: [
        this.HealthVaccinationRecordDetail.purpose,
        [Validators.required],
      ],
      nextDueDate: [
        this.HealthVaccinationRecordDetail.nextDueDate,
        [Validators.required],
      ],
      businessUnitId: [this.busUnitId],
    });
  }

  loadParties() {
    this.masterService.getParties(1).subscribe(
      (res) => {
        var dt = res;
        this.SupplierList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name,
          };
          this.SupplierList.push(_data);
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

  goBack() {
    this.location.back();
  }
}
