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
  AnimalModel,
  LiveStockModel,
} from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-animal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
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
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  isFemale: boolean = true;
  isActive: boolean = false;

  editAnimalModel!: FormGroup;
  AnimalDetail: AnimalModel = {
    animalId: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    animalType: '',
    businessUnit: '',
    breedRef: '',
    animalTypeId: 0,
    breedId: '',
    animalCode: '',
    age: '',
    isFemale: true,
    isActive: true,
    purchaseDate: '',
    price: 0,
    note: '',
    businessUnitId: '',
  };
  constAnimalDetail: AnimalModel = {
    animalId: '',
    createdBy: '',
    createdAt: '',
    animalRef: '',
    animalType: '',
    businessUnit: '',
    breedRef: '',
    animalTypeId: 0,
    breedId: '',
    animalCode: '',
    age: '',
    isFemale: true,
    isActive: true,
    purchaseDate: '',
    price: 0,
    note: '',
    businessUnitId: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private dairyFarmService: DairyFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService,
    private coldStoreService: ColdStoreServiceService
  ) {}
  ngOnInit() {
    this.animalId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');

    this.initForm();
    this.getAnimalDetails();
  }
  getAnimalDetails() {
    this.loading = true;
    this.dairyFarmService.GetAnimalDetail(this.animalId).subscribe(
      (dt) => {
        let data = dt.data;
        // let createdAt = data.createdAt.split('T')[0];
        this.AnimalDetail = {
          animalId: data.animalId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          animalRef: data.animalRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          breedRef: data.breedRef,
          animalTypeId: data.animalTypeId,
          breedId: data.breedId,
          animalCode: data.animalCode,
          age: data.age,
          isFemale: data.isFemale,
          isActive: data.isActive,
          purchaseDate: data.purchaseDate,
          price: data.price,
          note: data.note,
          businessUnitId: data.businessUnitId,
        };

        this.constAnimalDetail = {
          animalId: data.animalId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          animalRef: data.animalRef,
          animalType: data.animalType,
          businessUnit: data.businessUnit,
          breedRef: data.breedRef,
          animalTypeId: data.animalTypeId,
          breedId: data.breedId,
          animalCode: data.animalCode,
          age: data.age,
          isFemale: data.isFemale,
          isActive: data.isActive,
          purchaseDate: data.purchaseDate,
          price: data.price,
          note: data.note,
          businessUnitId: data.businessUnitId,
        };
        this.initForm();
        this.loadBusinessUnitTypes();
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
      .UpdateAnimalDetail(this.animalId, this.editAnimalModel.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Animal updated successfully',
            life: 3000,
          });
          // this.goBack();
          this.getAnimalDetails();
          this.editLoading = false;
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
      animalCode: this.constAnimalDetail.animalCode,
      age: this.constAnimalDetail.age,
      isFemale: this.constAnimalDetail.isFemale,
      isActive: this.constAnimalDetail.isActive,
      purchaseDate: this.constAnimalDetail.purchaseDate,
      price: this.constAnimalDetail.price,
      note: this.constAnimalDetail.note,
      businessUnitId: this.constAnimalDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }

  // initForm() {
  //   this.editLiveStockModel = this.formBuilder.group({
  //     businessUnitId: [this.AnimalDetail.businessUnitId, [Validators.required]],
  //     animalId: [this.AnimalDetail.animalId, [Validators.required]],
  //     createdBy: [this.AnimalDetail.createdBy, [Validators.required]],
  //     this.AnimalDetail.createdAt =
  //     this.AnimalDetail.createdAt?.split('T')[0] || '',
  //     quantity: [
  //       this.AnimalDetail.quantity,
  //       [
  //         Validators.required,
  //         Validators.pattern('^[1-9][0-9]*$'),
  //         Validators.min(1),
  //       ],
  //     ],
  //     arrivalDate: [this.AnimalDetail.arrivalDate, [Validators.required]],
  //     ageInDays: [
  //       this.AnimalDetail.ageInDays,
  //       [
  //         Validators.required,
  //         Validators.pattern('^[1-9][0-9]*$'),
  //         Validators.min(1),
  //       ],
  //     ],
  //     healthStatus: [this.AnimalDetail.healthStatus, [Validators.required]],
  //   });
  // }

  initForm() {
    this.AnimalDetail.purchaseDate =
      this.AnimalDetail?.purchaseDate?.split('T')[0] ?? '';
    this.editAnimalModel = this.formBuilder.group({
      animalTypeId: [this.AnimalDetail.animalTypeId, Validators.required],
      breedId: [this.AnimalDetail.breedId, Validators.required],
      animalCode: [this.AnimalDetail.animalCode, [Validators.required]],
      age: [this.AnimalDetail.age],
      isFemale: [this.AnimalDetail.isFemale, [Validators.required]],
      isActive: [this.AnimalDetail.isActive, [Validators.required]],
      purchaseDate: [this.AnimalDetail.purchaseDate, [Validators.required]],
      price: [this.AnimalDetail.price, [Validators.required]],
      note: [this.AnimalDetail.note, [Validators.required]],
      businessUnitId: [this.AnimalDetail.businessUnitId, [Validators.required]],
    });
  }
  loadBusinessUnitTypes() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessUnitTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.businessUnitTypes.push(_data);
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
  // editArchiveStatus() {
  //   this.coldStoreService
  //     .updateArchiveStatus(this.liveStockId, this.isArchived)
  //     .subscribe(
  //       (dt) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Update',
  //           detail: 'Cold store shelf change archived successfully',
  //           life: 3000,
  //         });
  //       },
  //       (error) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: error.message,
  //           life: 3000,
  //         });
  //         if (error.status == 401) {
  //           this.accountService.doLogout();
  //         }
  //       }
  //     );
  // }
  goBack() {
    this.location.back();
  }
}
