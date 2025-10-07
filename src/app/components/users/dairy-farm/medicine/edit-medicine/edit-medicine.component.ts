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
import { MedicineModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-medicine',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-medicine.component.html',
  styleUrl: './edit-medicine.component.scss',
  providers: [MessageService],
})
export class EditMedicineComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  medicineId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  BusinessUnits: masterModal[] = [];
  AnimalList: masterModal[] = [];
  SupplierList: masterModal[] = [];
  MedicineTypeList: masterModal[] = [];
  businessUnitId: any = null;
  delivered: boolean = true;
  breedId: any = null;

  editMedicineModel!: FormGroup;

  MedicineDetail: MedicineModel = {
    medicineId: '',
    medicineType: '',
    supplierName: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    name: '',
    dosage: '',
    expiryDate: '',
    quantity: 0,
    medicineTypeId: 0,
    price: 0,
    note: '',
    supplierId: '',
    businessUnitId: '',
  };
  constMedicine: MedicineModel = {
    medicineId: '',
    medicineType: '',
    supplierName: '',
    businessUnit: '',
    createdBy: '',
    createdAt: '',
    name: '',
    dosage: '',
    expiryDate: '',
    quantity: 0,
    medicineTypeId: 0,
    price: 0,
    note: '',
    supplierId: '',
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
    this.medicineId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getMedicineDetail();
    }, 0);
    this.loadParties();
  }
  getMedicineDetail() {
    this.loading = true;
    this.dairyFarmService.GetMedicineDetail(this.medicineId).subscribe(
      (dt) => {
        let data = dt.data;
        let arrDate = data.expiryDate?.split('T')[0];
        this.MedicineDetail = {
          medicineId: data.medicineId,
          medicineType: data.medicineType,
          supplierName: data.supplierName,
          businessUnit: data.businessUnit,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          supplierId: data.supplierId,
          expiryDate: arrDate,
          name: data.name,
          dosage: data.dosage,
          note: data.note,
          quantity: data.quantity,
          medicineTypeId: data.medicineTypeId,
          price: data.price,
          businessUnitId: data.businessUnitId,
        };
        this.constMedicine = {
          medicineId: data.medicineId,
          medicineType: data.medicineType,
          supplierName: data.supplierName,
          businessUnit: data.businessUnit,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          supplierId: data.supplierId,
          expiryDate: arrDate,
          name: data.name,
          dosage: data.dosage,
          note: data.note,
          quantity: data.quantity,
          medicineTypeId: data.medicineTypeId,
          price: data.price,
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
  editMedicineDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateMedicineDetail(this.medicineId, this.editMedicineModel.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Medicine updated successfully',
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
    this.MedicineDetail = {
      name: this.constMedicine.name,
      dosage: this.constMedicine.dosage,
      expiryDate: this.constMedicine.expiryDate,
      quantity: this.constMedicine.quantity,
      medicineTypeId: this.constMedicine.medicineTypeId,
      price: this.constMedicine.price,
      note: this.constMedicine.note,
      supplierId: this.constMedicine.supplierId,
      businessUnitId: this.constMedicine.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editMedicineModel = this.formBuilder.group({
      name: [this.MedicineDetail.name, [Validators.required]],
      dosage: [this.MedicineDetail.dosage, [Validators.required]],
      expiryDate: [this.MedicineDetail.expiryDate, [Validators.required]],
      quantity: [this.MedicineDetail.quantity, [Validators.required]],
      medicineTypeId: [
        this.MedicineDetail.medicineTypeId,
        [Validators.required],
      ],
      price: [this.MedicineDetail.price, [Validators.required]],
      note: [this.MedicineDetail.note, [Validators.required]],
      supplierId: [this.MedicineDetail.supplierId, [Validators.required]],
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
        this.loadMedicineType();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadMedicineType() {
    this.masterService.getMedicineType().subscribe(
      (res) => {
        let dt = res.data;
        this.MedicineTypeList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.MedicineTypeList.push(_data);
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
