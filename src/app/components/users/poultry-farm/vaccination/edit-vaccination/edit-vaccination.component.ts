import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { AccountService } from '../../../../../services/account-service/account.service';
import { VaccinationModel } from '../../../../../models/poultry-farm-model/poultry-farm-model';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';

@Component({
  selector: 'app-edit-vaccination',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    CheckboxModule,
    Skeleton,
    RouterLink,
  ],
  templateUrl: './edit-vaccination.component.html',
  styleUrl: './edit-vaccination.component.scss',
  providers: [MessageService],
})
export class EditVaccinationComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  inventoryItemId: any = null;
  busUnitId: any = null;
  businessUnitName: any = null;
  vaccinationDetail: VaccinationModel = {
    vaccinationId: '',
    refCount: 0,
    ref: '',
    businessUnitName: '',
    flockRef: '',
    createdAt: '',
    createdBy: '',
    vaccineName: '',
    businessUnitId: '',
    flockId: '',
    givenDate: '',
    givenBy: '',
    price: 0,
    supplierId: '',
    supplier: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}
  ngOnInit() {
    this.inventoryItemId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.getVaccinationDetail();
  }

  getVaccinationDetail() {
    this.loading = true;
    this.poultryFarmService.geVaccinationById(this.inventoryItemId).subscribe(
      (dt) => {
        let data = dt.data;
        this.vaccinationDetail = {
          vaccinationId: data.vaccinationId,
          refCount: data.refCount,
          ref: data.ref,
          businessUnitName: data.businessUnitName,
          flockRef: data.flockRef,
          createdAt: data.createdAt?.split('T')[0],
          createdBy: data.createdBy,
          vaccineName: data.vaccineName,
          businessUnitId: data.businessUnitId,
          flockId: data.flockId,
          givenDate: data.givenDate?.split('T')[0],
          givenBy: data.givenBy,
          price: data.price,
          supplierId: data.supplierId,
          supplier: data.supplier,
        };
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
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
