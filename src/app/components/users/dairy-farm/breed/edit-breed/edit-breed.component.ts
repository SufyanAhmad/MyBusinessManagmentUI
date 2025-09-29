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
import { BreedModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-breed',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-breed.component.html',
  styleUrl: './edit-breed.component.scss',
  providers: [MessageService],
})
export class EditBreedComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  breedId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalTypes: masterModal[] = [];

  editBreedForm!: FormGroup;

  BreedDetail: BreedModel = {
    breedId: '',
    breedRef: '',
    animalType: '',
    businessUnit: '',
    animalTypeId: 0,
    name: '',
    origin: '',
    note: '',
    businessUnitId: '',
  };
  constBreedDetail: BreedModel = {
    breedId: '',
    breedRef: '',
    animalType: '',
    businessUnit: '',
    animalTypeId: 0,
    name: '',
    origin: '',
    note: '',
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
    this.breedId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();

    this.initForm();
    this.getBreedDetails();
  }
  getBreedDetails() {
    this.loading = true;
    this.dairyFarmService.GetBreedDetail(this.breedId).subscribe(
      (dt) => {
        let data = dt.data;
        this.BreedDetail = {
          breedId: data.breedId,
          breedRef: data.breedRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          animalTypeId: data.animalTypeId,
          name: data.name,
          origin: data.origin,
          note: data.note,
          businessUnitId: data.businessUnitId,
        };
        this.constBreedDetail = {
          breedId: data.breedId,
          breedRef: data.breedRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          animalTypeId: data.animalTypeId,
          name: data.name,
          origin: data.origin,
          note: data.note,
          businessUnitId: data.businessUnitId,
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
  editLiveStockDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateBreedDetail(this.breedId, this.editBreedForm.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Breed updated successfully',
            life: 3000,
          });
          this.getBreedDetails();
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
    this.BreedDetail = {
      breedId: this.constBreedDetail.breedId,
      breedRef: this.constBreedDetail.breedRef,
      animalType: this.constBreedDetail.animalType,
      businessUnit: this.constBreedDetail.businessUnit,
      animalTypeId: this.constBreedDetail.animalTypeId,
      name: this.constBreedDetail.name,
      origin: this.constBreedDetail.origin,
      note: this.constBreedDetail.note,
      businessUnitId: this.constBreedDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editBreedForm = this.formBuilder.group({
      businessUnitId: [this.busUnitId],
      animalTypeId: [this.BreedDetail.animalTypeId, [Validators.required]],
      name: [this.BreedDetail.name, [Validators.required]],
      origin: [this.BreedDetail.origin],
      note: [this.BreedDetail.note],
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
