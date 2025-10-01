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
import { HealthRecordModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
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
  animalHealthId: any = null;
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

  HealthVaccinationRecordDetail: HealthRecordModel = {
    animalHealthId: '',
    animalHealthRef: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    businessUnit: '',
    animalId: '',
    businessUnitId: '',
    weight: 0,
    temperature: 0,
    illnessNotes: '',
    medicineTreatment: '',
    lastCheckupDate: '',
    remarks: '',
  };
  constHealthVaccinationRecord: HealthRecordModel = {
    animalHealthId: '',
    animalHealthRef: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    businessUnit: '',
    animalId: '',
    businessUnitId: '',
    weight: 0,
    temperature: 0,
    illnessNotes: '',
    medicineTreatment: '',
    lastCheckupDate: '',
    remarks: '',
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
    this.animalHealthId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getHealthVaccinationRecordDetails();
    }, 0);
    this.loadAnimal();
  }
  getHealthVaccinationRecordDetails() {
    this.loading = true;
    this.dairyFarmService.GetHealthRecordDetail(this.animalHealthId).subscribe(
      (dt) => {
        let data = dt.data;
        this.isArchived = data.archived;
        let createdDate = data.createdAt?.split('T')[0];
        let CheckupDate = data.lastCheckupDate?.split('T')[0];
        this.HealthVaccinationRecordDetail = {
          animalHealthId: data.animalHealthId,
          animalHealthRef: data.animalHealthRef,
          createdBy: data.createdBy,
          createdAt: createdDate,
          animalRef: data.animalRef,
          businessUnit: data.businessUnit,
          animalId: data.animalId,
          businessUnitId: data.businessUnitId,
          weight: data.weight,
          temperature: data.temperature,
          illnessNotes: data.illnessNotes,
          medicineTreatment: data.medicineTreatment,
          lastCheckupDate: CheckupDate,
          remarks: data.remarks,
        };
        this.constHealthVaccinationRecord = {
          animalHealthId: data.animalHealthId,
          animalHealthRef: data.animalHealthRef,
          createdBy: data.createdBy,
          createdAt: createdDate,
          animalRef: data.animalRef,
          businessUnit: data.businessUnit,
          animalId: data.animalId,
          businessUnitId: data.businessUnitId,
          weight: data.weight,
          temperature: data.temperature,
          illnessNotes: data.illnessNotes,
          medicineTreatment: data.medicineTreatment,
          lastCheckupDate: CheckupDate,
          remarks: data.remarks,
        };
        this.initForm();
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
  editHealthVaccinationRecordDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateHealthVaccinationRecordDetail(
        this.animalHealthId,
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
      animalId: this.constHealthVaccinationRecord.animalId,
      businessUnitId: this.constHealthVaccinationRecord.businessUnitId,
      weight: this.constHealthVaccinationRecord.weight,
      temperature: this.constHealthVaccinationRecord.temperature,
      illnessNotes: this.constHealthVaccinationRecord.illnessNotes,
      medicineTreatment: this.constHealthVaccinationRecord.medicineTreatment,
      lastCheckupDate: this.constHealthVaccinationRecord.lastCheckupDate,
      remarks: this.constHealthVaccinationRecord.remarks,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editHealthVaccinationRecordModel = this.formBuilder.group({
      animalId: [
        this.HealthVaccinationRecordDetail.animalId,
        [Validators.required],
      ],
      weight: [
        this.HealthVaccinationRecordDetail.weight,
        [Validators.required],
      ],
      temperature: [
        this.HealthVaccinationRecordDetail.temperature,
        [Validators.required],
      ],
      illnessNotes: [
        this.HealthVaccinationRecordDetail.illnessNotes,
        [Validators.required],
      ],
      medicineTreatment: [
        this.HealthVaccinationRecordDetail.medicineTreatment,
        [Validators.required],
      ],
      lastCheckupDate: [
        this.HealthVaccinationRecordDetail.lastCheckupDate,
        [Validators.required],
      ],
      remarks: [
        this.HealthVaccinationRecordDetail.remarks,
        [Validators.required],
      ],
      businessUnitId: [this.busUnitId],
    });
    console.log('Form Value: ', this.editHealthVaccinationRecordModel.value);
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
