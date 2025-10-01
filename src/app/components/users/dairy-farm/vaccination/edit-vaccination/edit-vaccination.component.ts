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
import { AnimalHealthVaccination } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-vaccination',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-vaccination.component.html',
  styleUrl: './edit-vaccination.component.scss',
  providers: [MessageService],
})
export class EditVaccinationComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  animalHealthVaccinationMappingId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  businessUnitTypes: masterModal[] = [];
  AnimalList: masterModal[] = [];
  AnimalHealthVaccinationList: masterModal[] = [];
  businessUnitId: any = null;

  editVaccinationForm!: FormGroup;

  VaccinationDetail: AnimalHealthVaccination = {
    animalHealthVaccinationMappingId: '',
    animalHealthVaccinationStatusId: 0,
    animalHealthVaccinationStatus: '',
    animalRef: '',
    name: '',
    createdAt: '',
    date: '',
    animalId: '',
    healthVaccinationRecordId: '',
  };
  constVaccinationDetail: AnimalHealthVaccination = {
    animalHealthVaccinationMappingId: '',
    animalHealthVaccinationStatusId: 0,
    animalHealthVaccinationStatus: '',
    animalRef: '',
    name: '',
    createdAt: '',
    date: '',
    animalId: '',
    healthVaccinationRecordId: '',
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
    this.animalHealthVaccinationMappingId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
    this.getVaccinationDetails();
  }
  ngAfterViewInit() {
    this.loadAnimal();
  }
  getVaccinationDetails() {
    this.loading = true;
    this.dairyFarmService
      .getAnimalHealthVaccinationDetail(this.animalHealthVaccinationMappingId)
      .subscribe(
        (dt) => {
          let data = dt.data;
          let arrDate = data.date.split('T')[0];
          this.VaccinationDetail = {
            animalHealthVaccinationMappingId:
              data.animalHealthVaccinationMappingId,
            animalHealthVaccinationStatusId:
              data.animalHealthVaccinationStatusId,
            animalHealthVaccinationStatus: data.animalHealthVaccinationStatus,
            date: arrDate,
            animalRef: data.animalRef,
            name: data.name,
            createdAt: data.createdAt,
            animalId: data.animalId,
            healthVaccinationRecordId: data.healthVaccinationRecordId,
          };
          this.constVaccinationDetail = {
            animalHealthVaccinationMappingId:
              data.animalHealthVaccinationMappingId,
            animalHealthVaccinationStatusId:
              data.animalHealthVaccinationStatusId,
            animalHealthVaccinationStatus: data.animalHealthVaccinationStatus,
            date: arrDate,
            animalRef: data.animalRef,
            name: data.name,
            createdAt: data.createdAt,
            animalId: data.animalId,
            healthVaccinationRecordId: data.healthVaccinationRecordId,
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
  editAnimalHealthVaccination() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateAnimalHealthVaccinationDetail(
        this.animalHealthVaccinationMappingId,
        this.editVaccinationForm.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Vaccination Detail updated successfully',
            life: 3000,
          });
          this.getVaccinationDetails();
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
    this.VaccinationDetail = {
      animalHealthVaccinationStatusId:
        this.constVaccinationDetail.animalHealthVaccinationStatusId,
      animalId: this.constVaccinationDetail.animalId,
      name: this.constVaccinationDetail.name,
      date: this.constVaccinationDetail.date,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editVaccinationForm = this.formBuilder.group({
      animalHealthVaccinationStatusId: [
        this.VaccinationDetail.animalHealthVaccinationStatusId,
        [Validators.required],
      ],
      animalId: [this.VaccinationDetail.animalId, [Validators.required]],
      name: [this.VaccinationDetail.name, [Validators.required]],
      date: [this.VaccinationDetail.date, [Validators.required]],
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
        this.loadAnimalHealthVaccination();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalHealthVaccination() {
    this.masterService.getAnimalHealthVaccinationStatus().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalHealthVaccinationList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalHealthVaccinationList.push(_data);
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
