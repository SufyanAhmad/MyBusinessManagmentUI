import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { HealthHistoryComponent } from '../health-history/health-history.component';
import { VaccineRecordComponent } from '../vaccine-record/vaccine-record.component';
import { AnimalBreedComponent } from '../animal-breed/animal-breed.component';
import { PregnancyRecordComponent } from '../pregnancy-record/pregnancy-record.component';
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
import { AnimalModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';
import { AnimalMedicineComponent } from '../animal-medicine/animal-medicine.component';
@Component({
  selector: 'app-edit-animal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
    HealthHistoryComponent,
    VaccineRecordComponent,
    AnimalBreedComponent,
    PregnancyRecordComponent,
    AnimalMedicineComponent,
  ],
  templateUrl: './edit-animal.component.html',
  styleUrl: './edit-animal.component.scss',
  providers: [MessageService],
})
export class EditAnimalComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  animalId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalTypes: masterModal[] = [];
  AnimalStatus: masterModal[] = [];
  AnimalColor: masterModal[] = [];
  isFemale: boolean = true;
  isActive: boolean = false;
  key: any = null;
  Breeds: masterModal[] = [];

  editAnimalForm!: FormGroup;
  AnimalDetail: AnimalModel = {
    animalId: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    animalType: '',
    businessUnit: '',
    breedType: '',
    animalTypeId: 0,
    breedId: '',
    earTag: '',
    age: '',
    isFemale: true,
    isActive: true,
    purchaseDate: '',
    price: 0,
    note: '',
    businessUnitId: '',
    guardian1: '',
    guardian2: '',
    placeOfBirth: '',
    weight: '',
    animalStatusId: 0,
    animalStatus: '',
    animalColor: '',
    birthType: '',
    animalSourceType: '',
    animalSourceTypeId: 0,
    breedTypeId: 0,
    birthDate: '',
    animalColorId: 0,
    birthTypeId: 0,
  };

  constAnimalDetail: AnimalModel = {
    animalId: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    animalType: '',
    businessUnit: '',
    breedType: '',
    animalTypeId: 0,
    breedId: '',
    earTag: '',
    age: '',
    isFemale: true,
    isActive: true,
    purchaseDate: '',
    price: 0,
    note: '',
    businessUnitId: '',
    guardian1: '',
    guardian2: '',
    placeOfBirth: '',
    weight: '',
    animalStatusId: 0,
    animalStatus: '',
    animalColor: '',
    birthType: '',
    animalSourceType: '',
    animalSourceTypeId: 0,
    breedTypeId: 0,
    birthDate: '',
    animalColorId: 0,
    birthTypeId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.animalId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.getAnimalDetails();
    this.initForm();
  }
  getAnimalDetails() {
    this.loading = true;
    this.dairyFarmService.GetAnimalDetail(this.animalId).subscribe(
      (dt) => {
        let data = dt.data;
        let purchaseDate = data.purchaseDate?.split('T')[0];
        let birthDate = data.birthDate?.split('T')[0];
        this.AnimalDetail = {
          animalId: data.animalId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          animalRef: data.animalRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          breedType: data.breedType,
          animalTypeId: data.animalTypeId,
          breedId: data.breedId,
          earTag: data.earTag,
          age: data.age,
          isFemale: data.isFemale,
          isActive: data.isActive,
          purchaseDate: purchaseDate,
          price: data.price,
          note: data.note,
          businessUnitId: data.businessUnitId,
          guardian1: data.guardian1,
          guardian2: data.guardian2,
          placeOfBirth: data.placeOfBirth,
          weight: data.weight,
          animalStatusId: data.animalStatusId,
          animalStatus: data.animalStatus,
          animalColor: data.animalColor,
          birthType: data.birthType,
          animalSourceType: data.animalSourceType,
          animalSourceTypeId: data.animalSourceTypeId,
          breedTypeId: data.breedTypeId,
          birthDate: birthDate,
          animalColorId: data.animalColorId,
          birthTypeId: data.birthTypeId,
        };

        this.constAnimalDetail = {
          animalId: data.animalId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          animalRef: data.animalRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          breedType: data.breedType,
          animalTypeId: data.animalTypeId,
          breedId: data.breedId,
          earTag: data.earTag,
          age: data.age,
          isFemale: data.isFemale,
          isActive: data.isActive,
          purchaseDate: data.purchaseDate,
          price: data.price,
          note: data.note,
          businessUnitId: data.businessUnitId,
          guardian1: data.guardian1,
          guardian2: data.guardian2,
          placeOfBirth: data.placeOfBirth,
          weight: data.weight,
          animalStatusId: data.animalStatusId,
          animalStatus: data.animalStatus,
          animalColor: data.animalColor,
          birthType: data.birthType,
          animalSourceType: data.animalSourceType,
          animalSourceTypeId: data.animalSourceTypeId,
          breedTypeId: data.breedTypeId,
          birthDate: birthDate,
          animalColorId: data.animalColorId,
          birthTypeId: data.birthTypeId,
        };
        this.initForm();
        this.loadAnimalTypes();
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

  editAnimalDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateAnimalDetail(this.animalId, this.editAnimalForm.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Animal updated successfully',
            life: 3000,
          });
          this.getAnimalDetails();
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
    this.AnimalDetail = {
      animalTypeId: this.constAnimalDetail.animalTypeId,
      breedId: this.constAnimalDetail.breedId,
      earTag: this.constAnimalDetail.earTag,
      age: this.constAnimalDetail.age,
      isFemale: this.constAnimalDetail.isFemale,
      isActive: this.constAnimalDetail.isActive,
      purchaseDate: this.constAnimalDetail.purchaseDate,
      price: this.constAnimalDetail.price,
      note: this.constAnimalDetail.note,
      businessUnitId: this.constAnimalDetail.businessUnitId,
      guardian1: this.constAnimalDetail.guardian1,
      guardian2: this.constAnimalDetail.guardian2,
      placeOfBirth: this.constAnimalDetail.placeOfBirth,
      weight: this.constAnimalDetail.weight,
      animalStatusId: this.constAnimalDetail.animalStatusId,
      animalSourceTypeId: this.constAnimalDetail.animalStatusId,
      breedTypeId: this.constAnimalDetail.breedTypeId,
      birthDate: this.constAnimalDetail.birthDate,
      animalColorId: this.constAnimalDetail.animalColorId,
      birthTypeId: this.constAnimalDetail.birthTypeId,
    };
    this.isReadOnly = true;
    this.initForm();
  }

  initForm() {
    this.editAnimalForm = this.formBuilder.group({
      animalTypeId: [this.AnimalDetail.animalTypeId, Validators.required],
      breedTypeId: [this.AnimalDetail.breedTypeId],
      earTag: [this.AnimalDetail.earTag, [Validators.required]],
      age: [this.AnimalDetail.age],
      isFemale: [this.AnimalDetail.isFemale],
      isActive: [this.AnimalDetail.isActive],
      purchaseDate: [this.AnimalDetail.purchaseDate],
      price: [this.AnimalDetail.price],
      note: [this.AnimalDetail.note],
      businessUnitId: [this.busUnitId],
      guardian1: [this.AnimalDetail.guardian1],
      guardian2: [this.AnimalDetail.guardian2],
      placeOfBirth: [this.AnimalDetail.placeOfBirth],
      weight: [this.AnimalDetail.weight],
      animalStatusId: [this.AnimalDetail.animalStatusId],
      animalColorId: [this.AnimalDetail.animalColorId],
      birthDate: [this.AnimalDetail.birthDate],
    });
  }
  loadAnimalTypes() {
    this.masterService.getAnimalTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalTypes.push(_data);
        }
        this.loadBreeds();
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
            id: dt[a].key,
            type: dt[a].value,
          };
          this.Breeds.push(_data);
        }
        this.loadAnimalStatus();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalStatus() {
    this.masterService.getAnimalStatus().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalStatus = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalStatus.push(_data);
        }
        this.loadAnimalColor();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimalColor() {
    this.masterService.getAnimalColor().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalColor = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalColor.push(_data);
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
