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
import {
  LiveStockModel,
  PregnancyRecordModel,
} from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';
@Component({
  selector: 'app-edit-pregnancy-record',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
  ],
  templateUrl: './edit-pregnancy-record.component.html',
  styleUrl: './edit-pregnancy-record.component.scss',
  providers: [MessageService],
})
export class EditPregnancyRecordComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  pregnancyBirthRecordId: any = null;
  businessUnitName: any = '';
  isArchived: boolean = false;
  BusinessUnits: masterModal[] = [];
  AnimalList: masterModal[] = [];
  Breeds: masterModal[] = [];
  businessUnitId: any = null;
  delivered: boolean = true;
  breedId: any = null;

  editPregnancyRecordModel!: FormGroup;

  PregnancyRecordDetail: PregnancyRecordModel = {
    updatedBy: '',
    updatedAt: '',
    pregnancyBirthRecordId: '',
    recordRef: '',
    animalRef: '',
    breedRef: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    animalId: '',
    breedId: '',
    pregnantDate: '',
    expectedDelivery: '',
    actualDelivery: '',
    delivered: true,
    businessUnitId: '',
  };
  constPregnancyRecord: PregnancyRecordModel = {
    updatedBy: '',
    updatedAt: '',
    pregnancyBirthRecordId: '',
    recordRef: '',
    animalRef: '',
    breedRef: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    animalId: '',
    breedId: '',
    pregnantDate: '',
    expectedDelivery: '',
    actualDelivery: '',
    delivered: true,
    businessUnitId: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private masterService: MasterService,
    private coldStoreService: ColdStoreServiceService
  ) {}
  ngOnInit() {
    this.pregnancyBirthRecordId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');

    this.initForm();
    this.getPregnancyRecordDetails();
    this.loadAnimal();
    this.loadBreeds();
    this.loadBusinessUnits();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getPregnancyRecordDetails();
    }, 0);
  }
  getPregnancyRecordDetails() {
    this.loading = true;
    this.dairyFarmService
      .GetPregnancyRecordDetail(this.pregnancyBirthRecordId)
      .subscribe(
        (dt) => {
          let data = dt.data;
          this.isArchived = data.archived;
          let createdDate = data.createdAt?.split('T')[0];
          let pregnantDate = data.pregnantDate?.split('T')[0];
          let expectedDelivery = data.expectedDelivery?.split('T')[0];
          let actualDelivery = data.actualDelivery?.split('T')[0];
          this.PregnancyRecordDetail = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            pregnancyBirthRecordId: data.pregnancyBirthRecordId,
            recordRef: data.recordRef,
            animalRef: data.animalRef,
            breedRef: data.breedRef,
            businessUnit: data.businessUnit,
            createdBy: data.createdBy,
            createdAt: createdDate,
            animalId: data.animalId,
            breedId: data.breedId,
            pregnantDate: pregnantDate,
            expectedDelivery: expectedDelivery,
            actualDelivery: actualDelivery,
            delivered: data.delivered,
            businessUnitId: data.businessUnitId,
          };
          this.constPregnancyRecord = {
            updatedBy: data.updatedBy,
            updatedAt: data.updatedAt,
            pregnancyBirthRecordId: data.pregnancyBirthRecordId,
            recordRef: data.recordRef,
            animalRef: data.animalRef,
            breedRef: data.breedRef,
            businessUnit: data.businessUnit,
            createdBy: data.createdBy,
            createdAt: createdDate,
            animalId: data.animalId,
            breedId: data.breedId,
            pregnantDate: pregnantDate,
            expectedDelivery: expectedDelivery,
            actualDelivery: actualDelivery,
            delivered: data.delivered,
            businessUnitId: data.businessUnitId,
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
  editLiveStockDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdatePregnancyRecordDetail(
        this.pregnancyBirthRecordId,
        this.editPregnancyRecordModel.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Pregnancy Record updated successfully',
            life: 3000,
          });
          this.getPregnancyRecordDetails();
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
      .updateArchiveStatus(this.pregnancyBirthRecordId, this.isArchived)
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
    this.PregnancyRecordDetail = {
      animalId: this.constPregnancyRecord.animalId,
      breedId: this.constPregnancyRecord.breedId,
      pregnantDate: this.constPregnancyRecord.pregnantDate,
      expectedDelivery: this.constPregnancyRecord.expectedDelivery,
      actualDelivery: this.constPregnancyRecord.actualDelivery,
      delivered: this.constPregnancyRecord.delivered,
      businessUnitId: this.constPregnancyRecord.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editPregnancyRecordModel = this.formBuilder.group({
      animalId: [this.PregnancyRecordDetail.animalId, [Validators.required]],
      breedId: [this.PregnancyRecordDetail.breedId, [Validators.required]],
      pregnantDate: [
        this.PregnancyRecordDetail.pregnantDate,
        [Validators.required],
      ],
      expectedDelivery: [
        this.PregnancyRecordDetail.expectedDelivery,
        [Validators.required],
      ],
      actualDelivery: [
        this.PregnancyRecordDetail.actualDelivery,
        [Validators.required],
      ],
      delivered: [this.PregnancyRecordDetail.delivered, [Validators.required]],
      businessUnitId: [
        this.PregnancyRecordDetail.businessUnitId,
        [Validators.required],
      ],
    });
  }
  loadBusinessUnits() {
    this.masterService.getBusinessUnitTypesById(3).subscribe(
      (res) => {
        var dt = res;
        this.BusinessUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.BusinessUnits.push(_data);
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
  loadBreeds() {
    this.masterService.getBreeds().subscribe(
      (res) => {
        var dt = res.data;
        this.Breeds = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].breedId,
            type: dt[a].breedRef,
          };
          this.Breeds.push(_data);
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
