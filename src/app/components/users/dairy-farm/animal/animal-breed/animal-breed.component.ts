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
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
import { BreedModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-animal-breed',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    DialogModule,
  ],
  templateUrl: './animal-breed.component.html',
  styleUrl: './animal-breed.component.scss',
  providers: [MessageService],
})
export class AnimalBreedComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  breedId: any = null;
  animalId: any = null;
  name: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalTypes: masterModal[] = [];
  addLoading: boolean = false;
  visible: boolean = false;
  hasBreed: boolean = false;
  key: any = null;

  addBreedForm!: FormGroup;
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
    private dairyFarmService: DairyFarmService,
    private router: Router
  ) {}
  ngOnInit() {
    this.animalId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();

    this.initForm();
    this.AddBreedForm();
    this.getBreedDetails();
    this.loadAnimalTypes();
  }
  getBreedDetails() {
    this.loading = true;
    this.dairyFarmService.GetBreedByAnimalId(this.animalId).subscribe(
      (dt) => {
        let data = dt.data;
        this.breedId = data.breedId;
        this.name = data.name;
        this.hasBreed = !!data?.breedId;
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
  editBreed() {
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
      businessUnitId: this.constBreedDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editBreedForm = this.formBuilder.group({
      businessUnitId: [this.busUnitId],
      animalTypeId: [this.BreedDetail.animalTypeId, [Validators.required]],
      name: [this.name],
      origin: [this.BreedDetail?.origin],
    });
  }
  alreadyHasBreed = false;

  addBreed() {
    if (this.alreadyHasBreed) {
      return;
    }
    this.addLoading = true;
    this.dairyFarmService.addBreed(this.addBreedForm.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.alreadyHasBreed = true; // breed add ho gayi, ab disable kar do
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Breed added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  AddBreedForm() {
    this.addBreedForm = this.formBuilder.group({
      animalTypeId: [0, [Validators.required]],
      name: ['', [Validators.required]],
      origin: [''],
      note: [''],
      businessUnitId: [this.busUnitId],
    });
  }
  onDialogHide() {
    this.addBreedForm.reset();
  }
  onAddBreedClick() {
    if (this.hasBreed) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Already Exists',
        detail: 'This animal already has a breed added.',
        life: 3000,
      });
    } else {
      this.visible = true;
    }
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
