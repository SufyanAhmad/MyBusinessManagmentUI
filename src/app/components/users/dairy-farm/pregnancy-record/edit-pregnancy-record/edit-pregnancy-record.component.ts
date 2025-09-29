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
import { PregnancyRecordModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';
@Component({
  selector: 'app-edit-pregnancy-record',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
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
  busUnitId: any = null;
  isArchived: boolean = false;
  AnimalList: masterModal[] = [];
  Breeds: masterModal[] = [];
  businessUnitId: any = null;
  delivered: boolean = true;
  breedId: any = null;

  editPregnancyRecordForm!: FormGroup;

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
    private messageService: MessageService,
    private accountService: AccountService,
    private dairyFarmService: DairyFarmService,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.pregnancyBirthRecordId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();

    this.initForm();
    this.getPregnancyRecordDetails();
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
          this.loadAnimal();
          this.loadBreeds();
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
  editPregnancyRecordDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdatePregnancyRecordDetail(
        this.pregnancyBirthRecordId,
        this.editPregnancyRecordForm.value
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
    this.editPregnancyRecordForm = this.formBuilder.group({
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
  goBack() {
    this.location.back();
  }
}
