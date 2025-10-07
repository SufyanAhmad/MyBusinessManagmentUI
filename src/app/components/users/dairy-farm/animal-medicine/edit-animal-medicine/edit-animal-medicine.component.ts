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
  AnimalMedicineModel,
  MedicineModel,
} from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-animal-medicine',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-animal-medicine.component.html',
  styleUrl: './edit-animal-medicine.component.scss',
  providers: [MessageService],
})
export class EditAnimalMedicineComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  animalMedicineMappingId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  BusinessUnits: masterModal[] = [];
  AnimalList: masterModal[] = [];
  MedicineList: masterModal[] = [];
  MedicineTypeList: masterModal[] = [];
  businessUnitId: any = null;
  delivered: boolean = true;
  breedId: any = null;

  editAnimalMedicineModel!: FormGroup;

  AnimalMedicineDetail: AnimalMedicineModel = {
    animalMedicineMappingId: '',
    animalRef: '',
    medicineName: '',
    animalId: '',
    medicineId: '',
    date: '',
  };
  constAnimalMedicine: AnimalMedicineModel = {
    animalMedicineMappingId: '',
    animalRef: '',
    medicineName: '',
    animalId: '',
    medicineId: '',
    date: '',
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
    this.animalMedicineMappingId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getMedicineDetail();
    }, 0);
    this.loadAnimal();
  }
  getMedicineDetail() {
    this.loading = true;
    this.dairyFarmService
      .GetAnimalMedicineDetail(this.animalMedicineMappingId)
      .subscribe(
        (dt) => {
          let data = dt.data;
          let arrDate = data.date?.split('T')[0];
          this.AnimalMedicineDetail = {
            animalMedicineMappingId: data.animalMedicineMappingId,
            animalRef: data.animalRef,
            medicineName: data.medicineName,
            animalId: data.animalId,
            medicineId: data.medicineId,
            date: arrDate,
          };
          this.constAnimalMedicine = {
            animalMedicineMappingId: data.animalMedicineMappingId,
            animalRef: data.animalRef,
            medicineName: data.medicineName,
            animalId: data.animalId,
            medicineId: data.medicineId,
            date: arrDate,
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
  editMedicineDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateAnimalMedicineDetail(
        this.animalMedicineMappingId,
        this.editAnimalMedicineModel.value
      )
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Animal Medicine updated successfully',
            life: 3000,
          });
          this.getMedicineDetail();
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
    this.AnimalMedicineDetail = {
      animalMedicineMappingId: this.constAnimalMedicine.animalMedicineMappingId,
      animalRef: this.constAnimalMedicine.animalRef,
      medicineName: this.constAnimalMedicine.medicineName,
      animalId: this.constAnimalMedicine.animalId,
      medicineId: this.constAnimalMedicine.medicineId,
      date: this.constAnimalMedicine.date,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editAnimalMedicineModel = this.formBuilder.group({
      animalId: [this.AnimalMedicineDetail.animalId, [Validators.required]],
      medicineId: [this.AnimalMedicineDetail.medicineId, [Validators.required]],
      date: [this.AnimalMedicineDetail.date, [Validators.required]],
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
        this.loadMedicine();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadMedicine() {
    this.masterService.getMedicine().subscribe(
      (res) => {
        let dt = res.data;
        this.MedicineList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].medicineId,
            type: dt[a].name,
          };
          this.MedicineList.push(_data);
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
